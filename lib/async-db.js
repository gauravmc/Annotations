'use strict';

var AsyncStorage = require('react-native').AsyncStorage;

class AsyncDB {
  constructor() {
    this.storageKey = '@AnnotationsStore';
  }

  async read(key, callback) {
    try {
      var value = await AsyncStorage.getItem(this._key(key), callback);
      console.log(`AsyncDB: Read ${value} from ${key}`);
      return value;
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async create(key, value, callback) {
    try {
      await AsyncStorage.setItem(this._key(key), value, callback);
      console.log(`AsyncDB: Saved ${value} in ${key}`);
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

  async getAllKeys(callback) {
    try {
      await AsyncStorage.getAllKeys(callback);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  async append(key, value) {
    try {
      let existingValue = await this.read(key);
      if(existingValue) {
        existingValue = JSON.parse(existingValue);
        existingValue.push(value);
        await this.create(key, JSON.stringify(existingValue));
      } else {
        await this.create(key, JSON.stringify([value]));
      }
      console.log(`Merged ${value} in ${key}`);
    } catch (error) {
      console.error('AsyncDB error: ' + error.message);
    }
  }

  _key(key) {
    return `${this.storageKey}:${key}`;
  }
}

module.exports = new AsyncDB();
