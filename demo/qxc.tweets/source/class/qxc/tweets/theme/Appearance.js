/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define('qxc.tweets.theme.Appearance',
  {
    extend: qx.theme.simple.Appearance,

    appearances: {
      'tweet-view': {},

      'tweet-view/time': {
        style: function () {
          return {
            textColor: '#E0E0E0'
          };
        }
      },

      'toolbar': {
        style: function () {
          return {
            backgroundColor: 'window-border-inner'
          };
        }
      }
    }
  });
