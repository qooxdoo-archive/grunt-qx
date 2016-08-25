'use strict';

// grunt
module.exports = function (grunt) {
  var qxpath = 'qooxdoo';
  if ('QOOXDOO_PATH' in process.env) {
    qxpath = process.env.QOOXDOO_PATH;
  }

  var config = {
    qxcompiler: {
      options: {
        appClass: 'qxc.tweets.Application',
        appName: 'qxc.tweets',
        appTitle: 'qxc.tweets Demo',
        theme: 'qxc.tweets.theme.Theme',
        locales: ['en'],
        addScript: [],
        addCss: [],
        libraryDirs: [
          qxpath + '/framework',
          '.'
        ]
      },

      source: {
        options: {
          target: 'source',
          outDir: 'build/source/'
        }
      },

      build: {
        options: {
          target: 'build',
          outDir: 'build/build/',
          // Only available within the 'build' target.
          minify: true
        }
      },

      hybrid: {
        options: {
          target: 'hybrid',
          outDir: 'build/hybrid/'
        }
      }
    },

    watch: {
      qxc.tweets: {
        files: [
          'source/class/**/*.js'
        ],
        tasks: ['qxcompiler:source']
      }
    },

    connect: {
      server: {
        options: {
          livereload: true,
          base: '.',
          port: 8000
        }
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-qxcompiler');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Compile source, run server and watch it
  grunt.registerTask('serve', [
    'qxcompiler:source',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('default', [
    'qxcompiler:source'
  ]);
};
