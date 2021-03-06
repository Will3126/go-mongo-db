'use strict';

//---------------------------------------------------------------------------------------------------------------//

const { MongoClient } = require('mongodb');

//---------------------------------------------------------------------------------------------------------------//

class GoMongoDB {
    #client;

    /**
     * Provides a simplistic method of interacting with MongoDB servers
     * @param {String} connection_url the entire connection url
     */
    constructor(connection_url) {
        this.#client = new MongoClient(connection_url, {
            useUnifiedTopology: true,
        });
    }

    /**
     * @returns {MongoClient} the MongoDB client instance
     */
    get client() {
        return this.#client;
    }

    /**
     * Used internally to ensure a connection is initiated to the database before performing actions
     */
    async connect() {
        if (!this.client.isConnected()) await this.client.connect();
        return this;
    }

    /**
     * Destroys the connection to the database with no way to re-connect
     */
    async destroy() {
        return this.client.close();
    }

    /**
     * Fetches the specified database
     * @param {String} database_name 
     */
    database(database_name) {
        return this.#client.db(database_name);
    }

    /**
     * Fetches the specified collection from the database
     * @param {String} database_name 
     * @param {String} collection_name 
     */
    collection(database_name, collection_name) {
        return this.database(database_name).collection(collection_name);
    }

    /**
     * Finds all documents matching the filter
     * https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {*} filter (see url)
     */
    async find(database_name, collection_name, filter={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).find(filter).toArray();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates all documents matching the filter
     * https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {*} filter (see url)
     * @param {*} update (see url)
     * @param {*} options (see url)
     */
    async update(database_name, collection_name, filter={}, update={}, options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).updateMany(filter, update, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Adds documents to a specified collection
     * https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {Array<*>} items (see url)
     * @param {*} options (see url)
     */
    async add(database_name, collection_name, items=[], options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).insertMany(items, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Removes documents in a specified collection
     * https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany
     * @param {String} database_name 
     * @param {String} collection_name 
     * @param {*} filter (see url)
     * @param {*} options (see url)
     */
    async remove(database_name, collection_name, filter={}, options={}) {
        try {
            await this.connect();
            return await this.collection(database_name, collection_name).deleteMany(filter, options);
        } catch (error) {
            throw error;
        }
    }
}

//---------------------------------------------------------------------------------------------------------------//

module.exports = {
    GoMongoDB,
};
