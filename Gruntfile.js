/*
 * grunt-qx-build
 * https://github.com/drawstack/grunt-qx-build
 *
 * Copyright (c) 2016 Rene Jochum
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  var qxpath = '../vendor/qooxdoo';
  if ('QOOXDOO_PATH' in process.env) {
    qxpath = process.env.QOOXDOO_PATH;
  }

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run
    qxcompiler: {
      options: {
        appClass: 'qxpromiserest_demo.Application',
        appName: 'qxpromiserest_demo',
        appTitle: 'QxPromiserestRest Demo',
        theme: 'qxpromiserest_demo.theme.Theme',
        locales: ['en'],
        addScript: [
          '%(QXPROMISE)s/resource/qxpromise/js/es5-sham.min.js',
          '%(QXPROMISEREST)s/resource/qxpromiserest/js/fetch.min.js',
          '%(QXPROMISE)s/resource/qxpromise/js/es5-shim.min.js',
          '%(QXPROMISE)s/resource/qxpromise/js/bluebird.min.js',
          '%(QXPROMISE)s/resource/qxpromise/js/alameda.min.js'
        ],
        addCss: [],
        libraryDirs: [
          qxpath + '/framework',
          '../qxpromiserest/vendor/qxpromise',
          '../qxpromiserest',
          '../qxpromiserest/demo/default'
        ]
      },

      source: {
        options: {
          target: 'source',
          outDir: 'out/source/'
        }
      },

      build: {
        options: {
          target: 'build',
          outDir: 'out/build/',
          // Only available within the 'build' target.
          minify: true
        }
      },

      hybrid: {
        options: {
          target: 'hybrid',
          outDir: 'out/hybrid/'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('lint', ['jshint']);

  // lint by default
  grunt.registerTask('default', ['lint']);
};
