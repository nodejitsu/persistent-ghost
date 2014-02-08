/**
 * REQUIRED: MongoDB connection string. Example: mongoHQ via nodejitsu
 *
 * @type {String}
 */
exports.mongo = 'mongodb://localhost:27017/ghost';

/**
 * Which themes should be added to /themes, provide as { name: source }.
 * Source can either be a valid git URL or the name of a submodule.
 *
 * @type {Object}
 */
exports.themes = {
  casper: 'git://github.com/TryGhost/Casper.git'
};

/**
 * OPTIONAL: Provide e-mail service configuration, not providing these details will
 * disable password recovery, also a closeable warning is shown.
 *
 * @type {Array}
 */
exports.mail = {};
