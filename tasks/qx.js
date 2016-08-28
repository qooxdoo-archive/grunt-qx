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
const sprintf = require('sprintf');

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
      addScript: [],
      addCss: [],
      libaryHints: {},
      libraryDirs: [
        'node_modules'
      ],
      // Only available within the 'source' target.
      copyResources: true
    });

    // Tell grunt to wait for my tasks.
    var done = this.async();

    var appManifest = new gqxc.Manifest(options.appPath, grunt);
    var depsPromise = appManifest.getDependecies(options.libaryHints, options.libraryDirs);
    depsPromise.then(function (dependencies) {
      // addScript/addCss Variables
      var addVariables = {};

      dependencies.forEach(function (m) {
        var addVarStore = addVariables;
        var namespace = m.getNamespace().toUpperCase();
        var splitted = namespace.split('.');

        // If we aren't using copyResources and the target is either
        // 'source' or 'hybrid' we have to make a relative path for
        // the inclusion URL else we can use '.'.
        if (!options.copyResources &&
            (options.target === 'source' || options.target === 'hybrid')) {
          // Relative path for external resources.
          var libraryDir = path.relative(
            path.join(process.cwd(), options.outDir),
            path.join(process.cwd(), m.getDirectory(), 'source')
          );
          for (var i = 0; i < splitted.length - 1; i++) {
            var sp = splitted[i];
            if (!(sp in addVarStore)) {
              addVarStore[sp] = {};
            }
            addVarStore = addVarStore[sp];
          }
          addVarStore[splitted[splitted.length - 1]] = libraryDir;
        } else {
          for (var x = 0; x < splitted.length - 1; x++) {
            var sp2 = splitted[x];
            if (!(sp2 in addVarStore)) {
              addVarStore[sp2] = {};
            }
            addVarStore = addVarStore[sp2];
          }
          addVarStore[splitted[splitted.length - 1]] = '.';
        }

        // Fetch addScript/addCss from each dependency and add it to
        // to the options list.
        options.addScript = options.addScript.concat(m.getAddScript());
        options.addCss = options.addCss.concat(m.getAddCss());
      });

      // now replace variables in addScript / addCss.
      for (var i = 0; i < options.addScript.length; i++) {
        options.addScript[i] = sprintf(options.addScript[i], addVariables);
      }
      for (var x = 0; x < options.addCss.length; x++) {
        options.addCss[x] = sprintf(options.addCss[x], addVariables);
      }

      // Select the target and set its options.
      var target;
      var outDir;
      switch (options.target) {
        case 'source':
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.SourceTarget(outDir).set({
            addScript: options.addScript,
            addCss: options.addCss,
            copyResources: options.copyResources
          });
          break;
        case 'hybrid':
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.HybridTarget(outDir).set({
            addScript: options.addScript,
            addCss: options.addCss
          });
          break;
        default: // build
          outDir = path.join(process.cwd(), options.outDir);
          target = new qxcompiler.targets.BuildTarget(outDir).set({
            minify: options.minify,
            addScript: options.addScript,
            addCss: options.addCss
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
