'use strict';

//
// Require modules.
//
var fs = require('fs')
  , path = require('path')
  , notify = require('chokidar')
  , MongoClient = require('mongodb').MongoClient
  , config, watcher;

//
// Setup and sync.
//
config = require('./postdeploy');

//
// Constructor for Ghost blog and syncing of files
//
function Ghost() {
  //
  // Start Ghost blog.
  //
  require('ghost');

  //
  // Start listening for file changes in eiter sqlite or content, ignore journaling.
  //
  watcher = notify.watch(
    path.join(__dirname, 'node_modules', 'ghost', 'content'),
    { ignored: /\.db-journal$/ }
  );

  watcher
    .on('change', this.change)
    .on('add', this.add)
    .on('unlink', this.unlink)
    .on('err', console.error);
}

Ghost.prototype.change = function change(path, stat) {
  console.log(path, stat);
};

Ghost.prototype.add = function add(path, stat) {
  console.log(path, stat);
};

Ghost.prototype.unlink = function unlink(path) {
  console.log(path);
};

//
// Expose constructed instance.
//

module.exports = new Ghost;
// Setup connection that will be used to sync.
/*MongoClient.connect(config.mongo, function(err, db) {
    if(err) throw err;

);*/
