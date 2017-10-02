#! /usr/bin/env node
const cwd      = process.cwd();
const fs       = require("fs");
const debounce = require("debounce");
const shell    = require("shelljs");
const argv     = require("minimist")(process.argv.slice(2));
const chokidar = require("chokidar");
const findUp   = require("find-up");
const json     = require("comment-json");



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
 * Finds config file path by walking up directory tree
 * @return string - config file path
 */
function findConfigFilePath() {
    return findUp.sync(".remotely.json");
}



/**
 * Read JSON File
 * @param {string} filePath
 * @return {object} config object 
 */
function readJSONFile(filePath) {
    const configContent = fs.readFileSync(filePath);
    const config = json.parse(configContent);
    return config;
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



/**
 * Read Sample Config
 */
function readSampleConfig() {
    return fs.readFileSync(`${__dirname}/sample_config.json`);
}



/**
 * Write config
 * @param {object} data 
 */
function writeConfig(data) {
    fs.writeFileSync(`${cwd}/.remotely.json`, data, { flag: 'w+' });
}



/**
 * Check if config exists
 */
const configFilePath = findConfigFilePath();

const command = argv._[0];

if (command === 'init') {
    writeConfig(readSampleConfig());
    process.exit(0);
}

if (!configFilePath) {
    Log("No config found. run ( $ remotely init ) in root directory");
    process.exit(1);
}




/**
 * Read config
 */
const fileConfig = readJSONFile(configFilePath);

const remotelyConfig = Object.assign({}, DEFAULT_OPTIONS, fileConfig);




/**
 * Create push pull rsync functions
 */
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





/**
 * Available Commands
 */

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