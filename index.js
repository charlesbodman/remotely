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
    rsync_flags: "-Wavzh --stats --delete",
    dry_run: true
};



/**
 * Logs a message to the console
 * @param {string} message - message to log
 */
function Log(message) {
    console.log(`${LOG_TAG} ${message}`);
}


/**
 * Log Error
 * @param {object} error 
 */
function LogError(error) {
    console.error(error);
    process.exit(1);
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
 * Listens for file changes and calls callback
 * @param {string} dir - directory to listen for changes
 * @param {function} callback - on change callback
 */
function listenToFileChanges(dir, action) {

    Log(`Listening to ${dir}`);

    /**
     * States
     */
    const STATES = {
        SYNCING: "SYNCING",
        READY: "READY",
        WAITING: "WAITING"
    }

    /**
     * Current state
     */
    let state = STATES.READY;

    const watcher = chokidar.watch(dir, { persistent: true });

    function onChange() {
        if (state === STATES.READY) {
            state = STATES.SYNCING;
            action().then(() => {
                const prevState = state;
                state = STATES.READY;
                if (prevState === STATES.WAITING) {
                    onChange();
                }
            });
        }
        else {
            Log("Will sync again after this sync completes");
            state = STATES.WAITING;
        }
    }

    watcher.on("change", debounce(onChange,200));
}





/**
 * Run remote to local rsync
 * @param {object} options - rsync options
 */
function createRsyncCommand({ source, dest, rsyncFlags, dryRun }) {
    return () => {
        return new Promise((resolve, reject) => {
            const command = `rsync ${rsyncFlags} ${dryRun ? "--dry-run" : ""} ${source}/ ${dest}`;
            Log(`Execting command ${command}`);
            shell.exec(command, (code, stdout, stderr) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(stderr));
                }
            });
        })

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
    Log("Config created, please edit (.remotely.json) with remote and host")
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
    rsyncFlags: remotelyConfig.rsync_flags,
    dryRun: remotelyConfig.dry_run
})

const pull = createRsyncCommand({
    source: remotelyConfig.remote,
    dest: remotelyConfig.local,
    rsyncFlags: remotelyConfig.rsync_flags,
    dryRun: remotelyConfig.dry_run
});





/**
 * Available Commands
 */

switch (command) {

    case "watch":
        listenToFileChanges(remotelyConfig.local, push );
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