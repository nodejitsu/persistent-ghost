'use strict';

var url = require('url')
  , mongo = require('mongodb')
  , Db = mongo.Db
  , Server = mongo.Server
  , MongoClient = mongo.MongoClient
  , GridStore = mongo.GridStore
  , ObjectID = mongo.ObjectID
  , config = require('./config')
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
    // First delete any currently available files, before adding again.
    //
    self.remove(filename, function clean(err) {
      if (err) return console.error(err);
      var gridStore = new GridStore(db, new ObjectID, filename, 'w');

      //
      // open Grid and write content.
      //
      gridStore.open(write);

      //
      // Write content to the grid, writeFile cannot be used
      // due to the absolute file path.
      //
      function write(err, store) {
        if (err) return console.error(err);
        store.write(content, flush);
      }

      //
      // Flush the file to GridFS.
      //
      function flush(err, store) {
        if (err) return console.error(err);
        store.close(fn);
      }
    });
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
 * @param {String} filename
 * @param {Function} fn callback
 * @api public
 */
Database.prototype.fetch = function fetch(filename, fn) {
  this.get(function open(db) {
    GridStore.read(db, filename, function(err, data) {
      if (err) return console.error(err);
      fn(null, data);
    });
  });
};

//
// Expose the database constructor
//
module.exports = Database;
