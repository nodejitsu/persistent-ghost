'use strict';

//
// Required modules.
//
var fs = require('fs')
  , mkdirp = require('mkdirp')
  , async = require('async')
  , path = require('path')
  , colors = require('colors')
  , Mongo = require('./mongo')
  , mongo = new Mongo;

//
// Create the proper configuration.
//
exports.setup = function setup(cb) {
  console.log('Running post-startup sync\n'.blue);
  var recover = process.env.RECOVER;

  fetch();

  //
  // Get data from MongoDB.
  //
  function fetch() {
    mongo.get(function open(db) {
      db.collection('fs.files')
        .find()
        .sort({ filename: 1, uploadDate: recover ? 1 : -1 })
        .toArray(process);
    });
  }

  //
  // Process each file in the results.
  //
  function process(err, results, prev) {
    if (err) return cb(err);

    results = results.filter(function newest(file) {
      if (prev === file.filename) return false;
      if (file.filename.match(/ghost.*db/)) return false; // Ignore database

      prev = file.filename;
      return true;
    });

    async.forEach(results, synchronise, function done() {
      console.log('\nPost-startup sync completed\n'.blue);
      cb.apply(cb, arguments);
    });
  }

  //
  // Get file content and save to filesystem.
  //
  function synchronise(file, fn) {
    var full = path.join(content + file.filename);

    // Get file content
    mongo.fetch(file, function save(err, data) {
      if (err) return fn(err);

      // Check if we need to do mkdir -p
      mkdirp(path.dirname(full), function(err, created) {
        if (err) return fn(err);
        if (created) console.log([
          ' +++'.magenta,
          created.replace(content, ''),
          'directory created'
        ].join(' '));

        // Write the content to disk.
        fs.writeFile(full, data, function saved(err) {
          if (err) return fn(err);

          console.log(' +++ '.green + file.filename + ' synced to drone');
          fn();
        });
      });
    });
  }
};
