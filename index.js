'use strict';

//
// Require modules.
//
var fs = require('fs')
  , path = require('path')
  , notify = require('chokidar')
  , Mongo = require('./mongo')
  , mongo = new Mongo
  , content = path.join(__dirname, 'node_modules', 'ghost', 'content');

//
// Constructor for Ghost blog and syncing of files
//
function Ghost() {
  var ghost = this;

  //
  // Setup and sync.
  //
  require('./postdeploy').setup(function done(err) {
    if (err) throw err;

    //
    // Start listening for file changes in eiter sqlite or content, ignore journaling.
    //
    ghost.watcher = notify.watch(content, { ignored: /\.db-journal$/ })
      .on('change', ghost.change)
      .on('unlink', ghost.unlink)
      .on('err', console.error);

    //
    // Start Ghost blog.
    //
    require('ghost');
  });
}

/**
 * Catch changes in content directory.
 *
 * @param {String} full
 * @api public
 */
Ghost.prototype.change = function change(full) {
  var rel = relative(full);

  fs.readFile(full, function read(err, content) {
    if (err) return console.error('Could not read: ' + relative);

    mongo.store(rel, content, function done() {
      console.log('Sync complete: ' + rel.green + ' - added || changed');
    });
  });
};

/**
 * Check for removal of content.
 * TODO: not yet implemented in ghost.
 *
 * @param {String} full
 * @api public
 */
Ghost.prototype.unlink = function unlink(full) {
  var rel = relative(full);
  console.log('Sync complete: ' + rel.red + ' - removed');
};

/**
 * Create local path from full.
 *
 * @
 * @returns {String} relative path
 * @api private
 */
function relative(full) {
  return full.replace(content, '');
}

//
// Expose constructed instance.
//
module.exports = new Ghost;
