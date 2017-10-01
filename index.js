#! /usr/bin/env node
const fs = require("fs");
const debounce = require("debounce");
const shell = require("shelljs");
const cwd = process.cwd();
const argv = require("minimist")(process.argv.slice(2));
const chokidar = require("chokidar");
const findUp = require("find-up");

/**
 * Log Tag
 */
const LOG_TAG = 'Remotely:'

/**
 * Default Options
 */
const DEFAULT_OPTIONS = {
    rsync_flags: "-Wavzh --stats --delete"
};


/**
 * Logs a message to the console
 * @param {string} message - message to log
 */
function Log(message) {
    console.log(`${LOG_TAG} ${message}`);
}


/**
 * Reads remotely config and returns config object
 */
function readRemotelyConfig() {
    return new Promise((resolve, reject) => {
        findUp(".remotely.json").then(filePath => {
            try {
                const configContent = fs.readFileSync(filePath);
                const config = JSON.parse(configContent);
                resolve(config);
            }
            catch (error) {
                reject(error);
            }
        }).catch(reject);
    });
}


/**
 * String matches regex array
 * @param {array} regexArray - array of regex's to match ignore
 * @param {string} needle - needle in the haystack
 */
function stringMatchesRegexArray(regexArray, needle) {
    return regexArray.reduce((prevMatch, regex) => {
        return prevMatch ? prevMatch : regex.test(needle);
    }, false);
}


/**
 * Listens for file changes and calls callback
 * @param {string} dir - directory to listen for changes
 * @param {function} callback - on change callback
 */
function listenToFileChanges(dir, callback) {
    Log(`Listening to ${dir}`);
    const watcher = chokidar.watch(dir, { persistent: true });
    watcher.on("change", function (path) {
        Log(`Change detected ${path}`);
        callback();
    });
}




/**
 * Run remote to local rsync
 * @param {object} options - rsync options
 */
function createRsyncCommand({ source, dest, rsync_flags }) {
    return () => {
        const command = `rsync ${rsync_flags} ${source}/ ${dest}`;
        Log(`Execting command ${command}`);
        shell.exec(command);
    };
}








readRemotelyConfig().then(config => {
    
    Log("Config found");

    const remotelyConfig = Object.assign({}, DEFAULT_OPTIONS, config);

    const push = createRsyncCommand({
        source: remotelyConfig.local,
        dest: remotelyConfig.remote,
        rsync_flags: remotelyConfig.rsync_flags
    })

    const pull = createRsyncCommand({
        source: remotelyConfig.remote,
        dest: remotelyConfig.local,
        rsync_flags: remotelyConfig.rsync_flags
    });

    const command = argv._[0];

    switch (command) {
        case "watch":
            listenToFileChanges(remotelyConfig.local, debounce(push, 100));
            break;

        case "pull":
            pull();
            break;

        case "push":
            push();
            break;

        default:
            Log(`Command ${command} not found`);
            break;
    }

});