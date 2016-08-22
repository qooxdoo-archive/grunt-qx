const fs = require('fs');
const qx = require('qooxdoo');
const path = require('path');

module.exports = qx.Class.define('gqxc.Manifest', {
  extend: qx.core.Object,

  construct: function (manifestPath) {
    this.base(arguments);

    this.__path = path.join(manifestPath, 'Manifest.json');
    this.__basePath = manifestPath;
    this.__data = JSON.parse(fs.readFileSync(this.__path, {encoding: 'utf8'}));
  },

  members: {
    __path: null,
    __basePath: null,
    __data: null,

    getData: function () {
      return this.__data;
    },

    getNamespace: function () {
      return this.__data.provides.namespace;
    },

    getClassPath: function () {
      return path.join(this.__basePath) + this.__data.provides.class;
    }
  }
});
