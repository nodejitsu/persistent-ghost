'use strict';

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
// Create the proper configuration.
//
exports.setup = function setup(cb) {
  console.log('Running pre-startup setup');

  //
  // Set the right content for production based on the local configuration.
  //
  config.development.url = 'http://localhost';
  config.production.url = 'http://' + pkg.subdomain + '.nodejitsu.com';
  config.production.mail = local.mail;

  //
  // Save the config.
  //
  fs.writeFile(
    path.join(part, 'config.js'),
    'module.exports=' + JSON.stringify(config) + '',
    fetch
  );

  //
  // Get data from MongoDB.
  //
  function fetch(err) {
    if (err) cb(err);

    cb(null);
    console.log('Pre-startup setup completed');
  }
};
