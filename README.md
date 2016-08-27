# grunt-qx

This plugin allows you to compile your Qooxdoo app with [qxcompiler](https://github.com/johnspackman/qxcompiler),
it adds ES6 compatiblity, multi app compilation and allows you to include contribs easily.

This project is a **WIP / Alpha release**. Expect things to be broken or getting changed.

For a minimal example see the authors [tweets app](https://github.com/pcdummy/qooxdoo-tweets-tutorial).

## Getting Started
This plugin requires Grunt `~1.0.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qx --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qx');
```

## The "qx" task

### Overview
In your project's Gruntfile, add a section named `qx` to the data object passed into `grunt.initConfig()`.

```js
var qxpath = '../vendor/qooxdoo';
if ('QOOXDOO_PATH' in process.env) {
  qxpath = process.env.QOOXDOO_PATH;
}

grunt.initConfig({
  // Configuration to be run
  qx: {
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
        outDir: 'build/source/',
        copyResources: true
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
  }
});
```

### Options

#### options.appClass
Type: `String`

Your applications class name.

#### options.appName
Type: `String`

Name of your application, will be used for "<appname>.html" and "<appname>/boot.js" in the output directory.

#### options.appTitle
Type: `String`

Title of your application - i'm not yet sure what is it for.

#### options.theme
Type: `String`

The theme of your application.

#### options.locales
Type: `Array`

Array of locales to integrate.

#### options.addScript
Type: `Array`

Array of scripts to load before Qooxdoo init, each entry can have a
sprintf style variable `%(<NAMESPACE>)` this will be replaced with the actual
path of the libraries source folder on a source/hybrid target, when using the
build target it will use '.' as replacement.

#### options.addCss
Type: `Array`

Same replacement as with `addScript` can happen  here.

#### options.libraryDirs
Type: `Array`

Relative or absolute paths to the libraries to include, each MUST have a "Manifest.json", make sure to add Qooxdoo itself here.

#### options.minify
Type: `Boolean`
Default: true

Minify the result in `build` targets?

#### options.copyResources
Type: `Boolean`
Default: false

Copy resources into the output directory on `source` targets?


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
