'use strict';

//
// Require modules.
//
var fs = require('fs')
  , path = require('path')
  , notify = require('chokidar')
  , Mongo = require('./lib/mongo')
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
  require('./lib/pre-startup').setup(function done(err) {
    if (err) throw err;

    //
    // Start Ghost blog.
    //
    ghost.blog = require('ghost')();


    //
    // Post Startup
    //
    require('./lib/post-startup').setup(function done(err) {
      //
      // Wait two second, to prevent premature triggering, before listening
      // for file changes in eiter sqlite or content, ignore journaling.
      //
      setTimeout(function defer() {
        ghost.watcher = notify.watch(content, { ignored: /README\.md|\/themes\/|\.git|\.db-journal$/ })
          .on('change', ghost.change)
          .on('add', ghost.change)
          .on('unlink', ghost.unlink)
          .on('err', console.error);
      }, 2000);
    });
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

    mongo.store(rel, content, function done(err) {
      if (err) return console.log(err);
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
