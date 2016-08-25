# qooxdoo "qxc.tweets" with [qxcompiler](https://github.com/johnspackman/qxcompiler) and [grunt-qxcompiler](https://github.com/drawstack/grunt-qxcompiler)

This is the qxc.tweets application from the offical Qooxdoo [tutorial](http://www.qooxdoo.org/current/pages/desktop/tutorials/tutorial-part-1.html), its also here as an
example for an app with QxCompiler and grunt-qxcompiler.

### Install

#### Clone

```bash
git clone https://github.com/pcdummy/qooxdoo-qxc.tweets-tutorial.git
```

#### Run npm install

```bash
cd qooxdoo-qxc.tweets-tutorial
npm install
```

#### Clone and checkout a special version of qooxdoo

```bash
git clone https://github.com/johnspackman/qooxdoo.git
cd qooxdoo
git checkout -b qxcompiler-master-v2 origin/qxcompiler-master-v2
cd ..
```

#### Set your QOOXDOO_PATH as env var

```bash
export QOOXDOO_PATH=$PWD/qooxdoo
```

#### Compile, serve with grunt-contrib-connect and watch it :)

```bash
grunt serve
```

Next go to http://localhost:8000/build/source/qxc.tweets.html

```bash
xdg-open http://127.0.0.1:8000/build/source/qxc.tweets.html
```

#### Compile it

```bash
grunt qxcompiler:source
```

#### Open in browser

```bash
xdg-open ./build/source/qxc.tweets.html
```

### Develop it

We added `grunt-contrib-watch` which means it will rebuild your Qx app on-to-fly.

Just run:

```
grunt watch
```

### License

MIT
