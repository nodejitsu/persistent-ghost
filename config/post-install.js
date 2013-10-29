'use strict';

/**
 * Post-install hook for the Jitsu CLI.
 *
 * @param {Jitsu} jitsu CLI tool instance
 * @param {Function} done callback
 * @api public
 */
module.exports = function postInstall(jitsu, done) {
  var database = jitsu.api.Databases
    , fs = require('fs');

  /**
   * Error processor.
   *
   * @param {Error} err
   * @api private
   */
  function error(err) {
    done('Installation of persistent-ghost failed', err);
  }

  /**
   * Create a mongoLab database.
   *
   * @api private
   */
  function create() {
    database.create('mongo', 'ghost', function create(err, result) {
      if (err) return error(err);
      setup(result.database);
    });
  }

  /**
   * Setup the connection string and store it in the config.
   *
   * @param {Object} database configuration and details object
   * @api private
   */
  function setup(database) {
    var data = database.metadata.uri + '/' + database.metadata.dbname;

    fs.readFile('./config.js', 'utf-8', function read(err, content) {
      if (err) return error(err);

      fs.writeFile('./config.js', content.replace('mongodb://localhost:27017/ghost', data), done);
    });
  }

  //
  // Check if the ghost database is already setup,
  // if not create a mongolab database.
  //
  database.get('ghost', function get(err, result) {
    if (err && !result) return create();
    setup(result.database);
  });
};
