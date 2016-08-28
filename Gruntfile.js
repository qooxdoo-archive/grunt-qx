/*
 * grunt-qx-build
 * https://github.com/drawstack/grunt-qx-build
 *
 * Copyright (c) 2016 Rene Jochum
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  var qxpath = 'qooxdoo';
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
    qx: {
      options: {
        appPath: 'demo/qxc.tweets',
        appClass: 'qxc.tweets.Application',
        appName: 'qxc.tweets',
        appTitle: 'qxc.tweets Demo',
        theme: 'qxc.tweets.theme.Theme',
        locales: ['en', 'de'],
        libaryHints: {
          'qooxdoo-sdk': qxpath + '/framework'
        }
      },

      tweetsSource: {
        options: {
          target: 'source',
          outDir: 'demo/qxc.tweets/build/source/',
          copyResources: true
        }
      },

      tweetsBuild: {
        options: {
          target: 'build',
          outDir: 'demo/qxc.tweets/build/build/',
          // Only available within the 'build' target.
          minify: true
        }
      },

      tweetsHybrid: {
        options: {
          target: 'hybrid',
          outDir: 'demo/qxc.tweets/build/hybrid/'
        }
      }
    },

    watch: {
      tweets: {
        files: [
          'demo/qxc.tweets/source/class/**/*.js'
        ],
        tasks: ['qx:tweetsSource']
      }
    },

    connect: {
      server: {
        options: {
          livereload: false,
          base: 'demo/qxc.tweets/build/source',
          port: 8000
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('lint', ['jshint']);

  // Compile source, run server and watch it
  grunt.registerTask('serve', [
    'qx:tweetsSource',
    'connect:server',
    'watch'
  ]);

  // lint by default
  grunt.registerTask('default', ['lint']);
};
