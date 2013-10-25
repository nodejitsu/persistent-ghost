'use strict';

//
// Create the proper configuration.
//
console.log('Running pre-startup setup');

//
// Required modules.
//
var fs = require('fs')
  , path = require('path')
  , local = require('./config')
  , pkg = require('./package');

//
// Path to config, get content and production config.
//
var part = path.join(__dirname, 'node_modules', 'ghost')
  , config = require( path.join(part, 'config.example.js'));

//
// Set the right content for production based on the local configuration.
//
config.development.url = 'http://localhost';
config.production.url = 'http://' + pkg.subdomain + '.nodejitsu.com';
config.production.mail = local.mail;

fs.writeFileSync(
  path.join(part, 'config.js'),
  'module.exports=' + JSON.stringify(config) + ''
);

//
// Get data from MongoDB.
//

//
// Expose the configuration.
//
module.exports = config;
console.log('Pre-startup setup completed');
