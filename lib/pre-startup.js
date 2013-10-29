'use strict';

//
// Required modules.
//
var fs = require('fs')
  , spawn = require('child_process').spawn
  , mkdirp = require('mkdirp')
  , async = require('async')
  , path = require('path')
  , colors = require('colors')
  , local = require('./config/config.json')
  , pkg = require('./package')
  , Mongo = require('./mongo')
  , mongo = new Mongo;

//
// Path to config, get content and production config.
//
var part = path.join(__dirname, 'node_modules', 'ghost')
  , content = path.join(part, 'content')
  , config = require(path.join(part, 'config.example.js'))
  , recover = process.env.RECOVER;

//
// Create the proper configuration.
//
exports.setup = function setup(cb) {
  console.log('Running pre-startup sync\n'.blue);

  //
  // Set the right content for production based on the local configuration.
  //
  config.development.url = 'http://localhost/';
  config.production.mail = local.mail;
  config.production.url = [
    'http://',
    pkg.domains && pkg.domains.length
      ? pkg.domains[0]
      : pkg.subdomain + '.nodejitsu.com'
  ].join('');

  //
  // Save the config.
  //
  fs.writeFile(
    path.join(part, 'config.js'),
    'module.exports=' + JSON.stringify(config) + '',
    getTheme
  );

  //
  // Git clone all provided themes.
  //
  function getTheme() {
    var themes = local.themes
      , target = path.join(content, 'themes');

    mkdirp(target, function(err, created) {
      if (err) return cb(err);

      async.forEach(Object.keys(themes), function clone(name, fn) {
        var themePath = path.join(target, name);
        fs.exists(themePath, function check(exists) {
          if (exists) return fn();
          var child = spawn('git', ['clone', themes[name], themePath]);
          child.on('exit', fn);
        });
      }, fetch);
    });
  }

  //
  // Get data from MongoDB.
  //
  function fetch(err) {
    if (err) cb(err);

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
      prev = file.filename;
      return true;
    });

    async.forEach(results, synchronise, function done() {
      console.log('\nPre-startup sync completed\n'.blue);
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

          console.log(' +++ '.green + file.filename + ' synced to server');
          fn();
        });
      });
    });
  }
};
