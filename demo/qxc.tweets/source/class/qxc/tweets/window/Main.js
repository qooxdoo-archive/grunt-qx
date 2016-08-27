/**
 * @asset(qxc.tweets/logo.png)
 */
qx.Class.define('qxc.tweets.window.Main', {
  extend: qx.ui.window.Window,

  events: {
    reload: 'qx.event.type.Event',
    post: 'qx.event.type.Data'
  },

  members: {
    getList: function () {
      return this.__list;
    }
  },

  construct: function () {
    this.base(arguments, 'tweets', 'qxc.tweets/logo.png');

    // Hide buttons
    this.setShowClose(false);
    this.setShowMaximize(false);
    this.setShowMinimize(false);

    // adjust size
    this.setWidth(250);
    this.setHeight(300);

    // add the layout
    var layout = new qx.ui.layout.Grid(0, 0);
    layout.setRowFlex(1, 1);
    layout.setColumnFlex(0, 1);
    this.setLayout(layout);
    this.setContentPadding(0);

    // toolbar
    var toolbar = new qx.ui.toolbar.ToolBar();
    this.add(toolbar, {row: 0, column: 0, colSpan: 2});

    // spacer
    toolbar.addSpacer();

    // settings button
    var settingsWindow = null;
    var settingsButton = new qx.ui.toolbar.Button(this.tr('Preferences'));
    toolbar.add(settingsButton);
    settingsButton.setToolTipText(this.tr('Change the applications settings.'));
    settingsButton.addListener('execute', function () {
      if (!settingsWindow) {
        settingsWindow = new qxc.tweets.window.Settings();
        settingsWindow.moveTo(320, 30);
      }
      settingsWindow.open();
    }, this);

    // reload button
    var reloadButton = new qx.ui.toolbar.Button(this.tr('Reload'));
    reloadButton.setToolTipText(this.tr('Reload the tweets.'));
    reloadButton.addListener('execute', function () {
      this.fireEvent('reload');
    }, this);
    toolbar.add(reloadButton);

    // list
    this.__list = new qx.ui.list.List();
    this.add(this.__list, {row: 1, column: 0, colSpan: 2});

    // post button
    var textarea = new qx.ui.form.TextArea();
    var postButton = new qx.ui.form.Button(this.tr('Post'));
    postButton.setToolTipText(this.tr('Post this message on identi.ca'));
    postButton.setWidth(60);
    postButton.setEnabled(false);
    postButton.addListener('execute', function () {
      this.fireDataEvent('post', textarea.getValue());
    }, this);

    // textarea
    textarea.setPlaceholder(this.tr('Enter your message here...'));
    textarea.addListener('input', function (e) {
      var value = e.getData();
      postButton.setEnabled(value.length <= 140 && value.length > 0);
    }, this);

    this.add(textarea, {row: 2, column: 0});
    this.add(postButton, {row: 2, column: 1});
  }
});
