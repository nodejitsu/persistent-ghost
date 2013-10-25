'use strict';

//
// Create the proper configuration.
//
console.log('Running postdeploy setup');

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
var config = path.join(__dirname, 'node_modules', 'ghost', 'config.js')
  , part = require(config).production;

//
// Set the right content for production based on the local configuration.
//
part.url = 'http://' + pkg.subdomain + '.nodejitsu.com';
part.mail = local.mail;

fs.writeFileSync(
  config,
  'module.exports={production:' + JSON.stringify(part) + '}'
);

//
// Get data from MongoDB.
//


console.log('Postdeploy setup completed');
