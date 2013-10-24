'use strict';

//
// Required modules.
//
var fs = require('fs')
  , pkg = require('./package');

//
// Create the proper configuration.
//
console.log('Running postdeploy script');

//
// Set the right URL based on the package subdomain.
//
