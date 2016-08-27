qx.Class.define('qxc.tweets.service.Identica', {
  extend: qx.core.Object,

  properties: {
    tweets: {
      nullable: true,
      event: 'changeTweets'
    }
  },

  members: {
    __store: null,

    fetchTweets: function () {
      if (this.__store === null) {
        var url = 'http://demo.qooxdoo.org/5.0.1/tweets_step4.5/resource/tweets/service.js';
        this.__store = new qx.data.store.Jsonp();
        this.__store.setCallbackName('callback');
        this.__store.setUrl(url);
        this.__store.bind('model', this, 'tweets');
      } else {
        this.__store.reload();
      }
    }
  }
});
