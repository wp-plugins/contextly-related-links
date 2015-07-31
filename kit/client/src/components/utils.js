(function ($) {

  /**
   * @class
   */
  Contextly.Utils = Contextly.createClass({

    statics: /** @lends Contextly.Utils */ {

      dateTextDiff: function(date) {
        if (date && date.length > 4) {
          var t = date.split(/[- :]/);
          var js_date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

          var timestamp = js_date.getTime() / 1000;
          var difference = new Date().getTime() / 1000 - timestamp;

          var periods = new Array("sec", "min", "hour", "day", "week", "month", "year", "decade");
          var lengths = new Array("60", "60", "24", "7", "4.35", "12", "10");
          var ending;

          if (difference > 0) {
            // this was in the past
            ending = "ago";
          }
          else { // this was in the future
            return 'right now';
          }

          for (var j = 0; difference >= lengths[j]; j++) {
            difference /= lengths[j];
          }
          difference = Math.round(difference);

          if (difference != 1) {
            periods[j] += "s";
          }
          return difference + "&nbsp;" + periods[j] + "&nbsp;" + ending;
        }
      },

      escape: function(text) {
        if (text) {
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }
        return '';
      },

      escapeSizzleAttrValue: function(value) {
        if (!value) {
          return '';
        }

        return value.replace('"', '\\\"');
      },

      /**
       * Writes an error to the browser console, if any.
       */
      logError: function() {
        if (window.console && typeof console.error === 'function') {
          console.error.apply(console, arguments);
        }
      },

      isEmailValid: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },

      /**
       * Returns true if passed object is an array.
       *
       * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
       */
      isArray: function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
      },

      /**
       * Returns true if passed variable is string.
       *
       * @see http://stackoverflow.com/a/9436948/404521
       */
      isString: function(o) {
        return (typeof o === 'string' || o instanceof String);
      },

      /**
       * Returns true if the passed variable is an empty object.
       */
      isEmptyObject: function(o) {
        for (var key in o) {
          return false;
        }
        return true;
      },

      error: function(msg) {
        throw new Error(msg);
      },

      escapeRegexp: function(str) {
        if (!str) {
          return '';
        }

        // http://stackoverflow.com/a/6969486/404521
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      },

      parseUrlQueryParameter: function(key, url) {
        var expression = "[\\?&]" + this.escapeRegexp(key) + "\=([^&#]*)";
        var regexp = new RegExp(expression);
        var results = regexp.exec(url);
        if (results == null) {
          return '';
        }
        else {
          return results[1];
        }
      }

    }

  });

})(jQuery);