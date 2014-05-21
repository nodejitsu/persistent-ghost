'use strict';

//
// Configuration per environment, development is default. Configuration options:
//   - mongo: {String} MongoDB connection. Example: mongoHQ via nodejitsu.
//   - themes: {Object} name:source combination, valid git URL or submodule name.
//   - mail: {Object} optional e-mail service, required for password recovery.
//
var config = {
  development: {
    mongo: 'mongodb://localhost:27017/blog',
    themes: {
      casper: 'git://github.com/TryGhost/Casper.git'
    },
    mail: {}
  },

  production: {
    mongo:  'mongodb://localhost:27017/blog',
    themes: {
      casper: 'git://github.com/TryGhost/Casper.git'
    },
    mail: {}
  }
};

/**
 * Return the correct configuration based on environment.
 *
 * @param {String} env environment setting
 * @return {Object} configuration
 * @api public
 */
module.exports = function get(env) {
  return env in config ? config[env] : config.development;
};