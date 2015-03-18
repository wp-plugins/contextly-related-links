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

      loadCssFile: function(css_url, contextly_id) {
        if (contextly_id) {
          // Remove previously loaded script
          $('link[contextly_id="' + contextly_id + '"]').remove();
        }

        $("<link>")
          .attr({
            rel: "stylesheet",
            media: "screen",
            type: "text/css",
            href: css_url,
            contextly_id: contextly_id
          })
          .appendTo("head");
      },

      loadCustomCssCode: function(custom_css, contextly_id) {
        if (contextly_id) {
          // Remove previously loaded script
          $('style[contextly_id="' + contextly_id + '"]').remove();
        }

        $("head")
          .append("<style type='text/css' contextly_id='" + contextly_id + "'>" + custom_css + "</style>");
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
      }

    }

  });

})(jQuery);