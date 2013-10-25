/**
 * REQUIRED: MongoDB connection string. Example: mongoHQ via nodejitsu
 *
 * @type {String}
 */
exports.mongo = 'mongodb://localhost:27017/ghost';

/**
 * OPTIONAL: Provide e-mail service configuration, not providing these details will
 * disable password recovery, also a closeable warning is shown. Example: GMAIL
 *
 * @type {Array}
 */
exports.mail = {};
