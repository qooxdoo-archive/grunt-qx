const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const qx = require('qooxdoo');
const path = require('path');

const depCheckHints = function (dependecy, hints) {
  if (dependecy in hints) {
    return Promise.resolve(hints[dependecy]);
  }

  return Promise.reject(
    new Error('"' + dependecy + '" not in the list of hints.')
  );
};

const depInDir = function (dependency, dir) {
  var myDir = path.join(dir, dependency);
  return fs.lstatAsync(myDir)
    .then(function (stats) {
      if (stats.isDirectory()) {
        return Promise.resolve(myDir);
      }

      return Promise.reject(
        new Error('"' + dependency + '" not in "' + dir + '"')
      );
    }).catch(function () {
      return Promise.reject(
        new Error('"' + dependency + '" not in "' + dir + '"')
      );
    });
};

module.exports = qx.Class.define('gqxc.Manifest', {
  extend: qx.core.Object,

  construct: function (directory, grunt) {
    this.base(arguments);

    this.__grunt = grunt;
    this.__manifestPath = path.join(directory, 'Manifest.json');
    this.__directory = directory;

    this.__grunt.verbose.writeln('Reading "' + this.__manifestPath + '".');
    this.__dataPromise = fs.readFileAsync(this.__manifestPath, {encoding: 'utf8'})
      .then(function (data) {
        this.__data = JSON.parse(data);
        return this.__data;
      }.bind(this)
    );
  },

  members: {
    __grunt: null,
    __data: null,
    __manifestPath: null,
    __directory: null,
    __dataPromise: null,

    getDirectory: function () {
      return this.__directory;
    },

    getDataPromise: function () {
      return this.__dataPromise;
    },

    getNamespace: function () {
      return this.__data.provides.namespace;
    },

    getAddScript: function () {
      var result = [];
      if ('externalResources' in this.__data) {
        if ('script' in this.__data.externalResources) {
          this.__data.externalResources.script.forEach(function (script) {
            result.push('%(' + this.getNamespace().toUpperCase() + ')s/' + script);
          }.bind(this));
        }
      }

      return result;
    },

    getAddCss: function () {
      var result = [];
      if ('externalResources' in this.__data) {
        if ('css' in this.__data.externalResources) {
          this.__data.externalResources.css.forEach(function (css) {
            result.push('%(' + this.getNamespace().toUpperCase() + ')s/' + css);
          }.bind(this));
        }
      }

      return result;
    },

    /**
     * @return {Promise<List<gqxc.Manifest>>} List of dependencies in a Promise.
     */
    getDependecies: function (hints, dirs) {
      var grunt = this.__grunt;

      // The result.
      var result = [];
      result.push(this);

      // Save for added libraries to no add them twice.
      var addedLibraries = {};

      return this.__dataPromise.then(function (data) {
        // Get dependencies
        addedLibraries[this.getNamespace()] = null;
        var deps = data.dependencies || [];
        deps.reverse();
        return deps;
      }.bind(this)).map(function (dep) {
        // forEach dependency check over all available libraryDirs and hints.
        // and return an object gqxc.Manifest from the found path.
        var toCheck = [];
        toCheck.push(depCheckHints(dep, hints));
        dirs.forEach(function (dir) {
          toCheck.push(depInDir(dep, dir));
        });
        return Promise.any(toCheck)
          .then(function (dir) {
            var m = new gqxc.Manifest(dir, grunt);
            return m.getDependecies(hints, dirs, true);
          }).catch(function (err) {
            grunt.log.error('Can\'t find a library.');
            return Promise.reject(err);
          });
      }).then(function (subDeps) {
        // Now take the aggregated result and add it last in first in.
        // At the end you have the first given library first and
        // the last last.
        subDeps.forEach(function (mDeps) {
          mDeps.forEach(function (mDep) {
            if (mDep.getNamespace() in addedLibraries) {
              for (var i = 0; i < result.length; i++) {
                if (result[i].getNamespace() === mDep.getNamespace()) {
                  result.splice(i, 1);
                  break;
                }
              }
              result.splice(0, 0, mDep);
            } else {
              addedLibraries[mDep.getNamespace()] = null;
              result.splice(0, 0, mDep);
            }
          });
        });

        return result;
      });
    }
  }
});
