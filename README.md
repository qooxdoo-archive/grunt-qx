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
var qxpath = 'qooxdoo';
if ('QOOXDOO_PATH' in process.env) {
  qxpath = process.env.QOOXDOO_PATH;
}

grunt.initConfig({
  // Configuration to be run
  qx: {
    options: {
      appPath: '.',
      appClass: 'tweets.Application',
      appName: 'tweets',
      appTitle: 'tweets Demo',
      theme: 'tweets.theme.Theme',
      locales: ['en'],
      libaryHints: {
        'qooxdoo': qxpath + '/framework'
      }
    },

    source: {
      options: {
        target: 'source',
        outDir: 'build/source/',
        // Only available within the 'source' target.
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

#### options.appPath
Type: `String`
Default: '.'

Relative or absolute path to the application.

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

#### options.libraryDirs
Type: `Array`
Default: `[ 'node_modules' ]`

Relative or absolute paths to the libraries to include, each MUST have a "Manifest.json".

#### options.libraryHints
Type: `Map`

Map of relative or absolute paths to libraries which will overwrite `options.libraryDirs`.

For example:

```javascript
options: {
  libaryHints: {
    'qooxdoo': qxpath + '/framework'
  }
}
```

#### options.minify
Type: `Boolean`
Default: `true`

Minify the result in `build` targets?

#### options.copyResources
Type: `Boolean`
Default: `true`

Copy resources into the output directory on `source` targets?


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
