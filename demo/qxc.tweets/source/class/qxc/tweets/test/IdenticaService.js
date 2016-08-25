/**
 * @asset(qxc.tweets/logo.png)
 */
qx.Class.define('qxc.tweets.test.IdenticaService',
  {
    extend: qx.dev.unit.TestCase,

    members: {
      setUp: function () {
        this.__identicaService = new qxc.tweets.service.Identica();
      },

      tearDown: function () {
        this.__identicaService.dispose();
        this.__identicaService = null;
      },

      testFetchqxc.tweets: function () {
        this.__identicaService.addListener('changeqxc.tweets', function () {
          this.resume();
        }, this);

        qx.event.Timer.once(function () {
          this.__identicaService.fetchTweets();
        }, this, 100);

        this.wait(5000);
      }
    }
  });
