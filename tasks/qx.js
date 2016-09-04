/*
 * grunt-qx-build
 * https://github.com/drawstack/grunt-qx-build
 *
 * Copyright (c) 2016 Rene Jochum
 * Licensed under the MIT license.
 */

var gqxc = {};
gqxc.Manifest = require('./lib/gqxc/Manifest');

const qxcompiler = require('../vendor/qxcompiler/lib/qxcompiler');
const async = require('async');
const path = require('path');

module.exports = function (grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('qx', 'Qooxdoo builder.', function () {
    const STARTTIME = new Date();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      target: 'build',
      // Only available within the 'build' target.
      minify: true,
      outDir: 'out/',
      appPath: '.',
      appClass: 'tweets.Application',
      appName: 'tweets',
      appTitle: 'Tweets Demo',
      theme: 'tweets.theme.Theme',
      locales: ['en'],
      libraryHints: {},
      libraryDirs: [
        'node_modules'
      ],
      // Only available within the 'source' target.
      copyResources: true
    });

    // Tell grunt to wait for my tasks.
    var done = this.async();

    var appManifest = new gqxc.Manifest(options.appPath, grunt);
    var depsPromise = appManifest.getDependecies(options.libraryHints, options.libraryDirs);
    depsPromise.then(function (dependencies) {
      // Select the target and set its options.
      var target;
      var outDir;
      switch (options.target) {
        case 'source':
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.SourceTarget(outDir).set({
            copyResources: options.copyResources
          });
          break;
        case 'hybrid':
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.HybridTarget(outDir);
          break;
        default: // build
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.BuildTarget(outDir).set({
            minify: options.minify
          });
      }

      // The qxcompiler aka maker.
      var maker = new qxcompiler.makers.AppMaker().set({
        target: target,
        locales: options.locales,
        writeAllTranslations: true
      });
      maker.addApplication(new qxcompiler.Application(options.appClass, ['qx.core.Init']).set({
        theme: options.theme,
        name: options.appName,
        environment: {
          'qxt.applicationName': options.appTitle
        }
      }));

      // Per library maker.addLibrary(dir, callback);
      var asyncSeries = [];
      dependencies.forEach(function (m) {
        asyncSeries.push(function (cb) {
          grunt.log.ok('Adding library: ' + m.getNamespace());
          maker.addLibrary(m.getDirectory(), cb);
        });
      });

      asyncSeries.push(function (cb) {
        grunt.log.ok('Making the app - please be patient.');
        maker.make(cb);
      });

      async.series(
        asyncSeries,
        function (err) {
          if (err) {
            grunt.log.error([err]);
            done();
          } else {
            var diff = new Date().getTime() - STARTTIME.getTime();
            diff /= 1000;
            var mins = Math.floor(diff / 60);
            var secs = diff - (mins * 60);
            grunt.log.ok('Done in ' + mins + 'm ' + secs + 's');
            grunt.log.ok('Output Directory is: ' + outDir);
            done();
          }
        }
      );
    })
    .catch(function (err) {
      grunt.log.error(err);
    });
  });
};
