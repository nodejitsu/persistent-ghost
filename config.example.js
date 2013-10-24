/**
 * REQUIRED: MongoDB connection string. Example: mongoHQ via nodejitsu
 *
 * @type {String}
 */
exports.mongo = 'mongodb://nodejitsu:7f812389821312fd3192545fd9@paulo.mongohq.com:10051/nodejitsudb12938192';

/**
 * OPTIONAL: Provide e-mail service configuration, not providing these details will
 * disable password recovery, also a closeable warning is shown. Example: GMAIL
 *
 * @type {Array}
 */
exports.mail = {
  transport: 'SMTP',
  options: {
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  }
};
