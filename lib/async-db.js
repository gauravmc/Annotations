'use strict';

var AsyncStorage = require('react-native').AsyncStorage;

class AsyncDB {
  constructor() {
    this.storageKey = '@AnnotationsStore';
    // Temporary
    // AsyncStorage.clear();
  }

  async read(key, callback) {
    try {
      var value = await AsyncStorage.getItem(this._key(key));
      console.log(`AsyncDB: Read ${value} from ${key}`);
      value = JSON.parse(value);
      if(callback) callback(null, value);
      return value;
    } catch (error) {
      if(callback) callback(error, null);
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async create(key, value, callback) {
    try {
      value = JSON.stringify(value);
      await AsyncStorage.setItem(this._key(key), value, callback);
      console.log(`AsyncDB: Saved ${value} in ${key}`);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async merge(key, value, callback) {
    try {
      let existingObj = await this.read(key);
      value = Object.assign(existingObj, value);
      this.create(key, value, callback).done();
      console.log(`Merged ${value} in ${key}`);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async append(key, value) {
    try {
      let existingArray = await this.read(key);
      existingArray.push(value);
      this.create(key, existingArray).done();
      console.log(`Merged ${value} in ${key}`);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async delete(key, callback) {
    try {
      await AsyncStorage.removeItem(this._key(key), callback);
      console.log(`AsyncDB: Deleted ${key}`);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  _key(key) {
    return `${this.storageKey}:${key}`;
  }
}

module.exports = new AsyncDB();
