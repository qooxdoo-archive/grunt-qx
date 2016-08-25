/**
 * @asset(qxc.tweets/logo.png)
 */
qx.Class.define('qxc.tweets.test.TweetView', {
  extend: qx.dev.unit.TestCase,

  members: {
    setUp: function () {
      this.__tweetView = new qxc.tweets.widget.Tweet();
    },

    tearDown: function () {
      this.__tweetView.dispose();
      this.__tweetView = null;
    },

    testSetIcon: function () {
      var expectedSource = qx.util.ResourceManager.getInstance().toUri('logo.png');
      this.__tweetView.setIcon(expectedSource);
      var foundSource = this.__tweetView.getChildControl('icon').getSource();
      this.assertEquals(expectedSource, foundSource, 'Icon source was not set correctly!');
    }
  }
});
