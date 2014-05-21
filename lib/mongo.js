'use strict';

var url = require('url')
  , async = require('async')
  , mongo = require('mongodb')
  , Db = mongo.Db
  , Server = mongo.Server
  , MongoClient = mongo.MongoClient
  , GridStore = mongo.GridStore
  , ObjectID = mongo.ObjectID
  , config = require('../config')(process.env.NODE_ENV)
  , database;

//
// Constructor for database sync.
//
function Database() {
  this.options = url.parse(config.mongo);
}

/**
 * Singleton connection logic.
 *
 * @param {Function} fn callback
 * @api public
 */
Database.prototype.get = function get(fn) {
  if (database) return process.nextTick(fn.bind(this, database));

  var options = this.options
    , server = new Server(options.hostname, options.port);

  new Db(options.pathname.replace('/', ''), server, { safe: true }).open(function open(err, db) {
    if (err) throw err;
    if (!options.auth) return fn(database = db);

    //
    // Authenticate the connection if required.
    //
    var auth = options.auth.split(':');
    db.authenticate(auth[0], auth[1], function auth(err) {
      if (err) throw err;
      fn(database = db);
    });
  });
};

/**
 * Store the content of the file to MongoDB GridFS
 *
 * @param {String} filename
 * @param {Buffer} content file content
 * @param {Function} fn callback
 */
Database.prototype.store = function store(filename, content, fn) {
  var self = this;
  self.get(function open(db) {
    //
    // open Grid and write content.
    //
    var gridStore = new GridStore(db, new ObjectID, filename, 'w');
    gridStore.open(write);

    //
    // Write content to the grid, writeFile cannot be used
    // due to the absolute file path.
    //
    function write(err, store) {
      if (err) return fn(err);
      store.write(content, flush);
    }

    //
    // Flush the file to GridFS.
    //
    function flush(err, store) {
      if (err) return fn(err);
      store.close(cleanup);
    }

    //
    // Check if we need to delete older content.
    //
    function cleanup() {
      db.collection('fs.files')
        .find({ filename: filename })
        .sort({ uploadDate: 1 })
        .toArray(function process(err, results) {
          if (err) return fn(err);

          var n = results.length;
          if (n < 3) return fn(null);

          //
          // Delete oldest files but the last two.
          //
          async.forEach(results.splice(0, n - 2), function remove(file, done) {
            new GridStore(db, file._id, 'r').unlink(done);
          }, fn);
        });
    }
  });
};

/**
 * Remove the file from MongoDB GridFS
 *
 * @param {String} filename
 * @param {Function} fn callback
 * @api public
 */
Database.prototype.remove = function remove(filename, fn) {
  this.get(function open(db)  {
    GridStore.unlink(db, filename, fn);
  });
};

/**
 * Read the file from MongoDB GridFS.
 *
 * @param {Object} file
 * @param {Function} fn callback
 * @api public
 */
Database.prototype.fetch = function fetch(file, fn) {
  this.get(function open(db) {
    var gridStore = new GridStore(db, file._id, 'r');
    gridStore.open(function open(err, gridStore) {
      if (err) return fn(err);

      //
      // Reset read/write head to beginning of file.
      //
      gridStore.seek(0, function move(err, gridStore) {
        if (err) return fn(err);
        gridStore.read(fn);
      });
    });
  });
};

//
// Expose the database constructor
//
module.exports = Database;
