'use strict';

//
// Require modules.
//
var config = require('./config')
  , fs = require('fs')
  , MongoClient = require('mongodb').MongoClient
  , cwd = __dirname + '/ghost';

//
// Setup and sync.
//
require('./postdeploy');

//
// Start Ghost blog.
//
require('ghost');

// Setup connection that will be used to sync.
/*MongoClient.connect(config.mongo, function(err, db) {
    if(err) throw err;

});*/
