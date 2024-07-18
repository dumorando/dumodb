const fs = require('fs');
const path = require('path');

class FileDatabase {
    constructor(path) {
        /**
         * The path to the file
         * @type {string}
         */
        this.path = path;
        
        /**
         * The raw JSON data. Not recommended for use except internally.
         * @type {object}
         */
        this.data = {};

        //get the data
        this.getData();
    }
    
    /**
     * Pulls data from file. Not recommended for use except internally.
     */
    getData() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '{}');
            this.data = {};
            return; // we do this so we dont waste another fs call
        }

        this.data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    }

    /**
     * Pushes data to file. Not recommended for use except internally.
     */
    pushData() {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    /**
     * Gets data from a key.
     * @param {string} key
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Check if a key exists.
     * @param {string} key
     */
    has(key) {
        return !!this.data[key]; //very bad hack
    }

    /**
     * Set a key's value.
     * @param {string} key
     * @param {string} value
     */
    set(key, value) {
        this.data[key] = value;
        this.pushData();
    }

    /**
     * Delete a key.
     * @param {string} key
     */
    delete(key) {
        delete this.data[key];
        this.pushData();
    }

    /**
     * Delete all keys.
     */
    clear() {
        this.data = {};
        this.pushData();
    }

    /**
     * Get all keys and their data.
     */
    all() {
        return Object.entries(this.data);
    }

    /**
     * Creates a backup of the file.
     */
    backup() {
        fs.writeFileSync(`${this.path}.${Date.now()}.bak`, JSON.stringify(this.data));
    }

    /**
     * Gets the keys.
     */
    keys() {
        return Object.keys(this.data);
    }
}

/**
 * Uses a database.
 */
class Database {
    constructor(directory) {
        /**
         * The directory the database is located in.
         */
        this.directory = directory;

        /**
         * Only for internal use.
         */
        this.instances = {};

    }

    /**
     * Opens and returns a key value store.
     * @param {string} id 
     * @returns {FileDatabase}
     */
    store(id) {
        if (this.instances[id]) return this.instances[id];

        this.instances[id] = new FileDatabase(path.join(this.directory, `${id}.json`));
        return this.store(id);
    }
}

module.exports = Database;