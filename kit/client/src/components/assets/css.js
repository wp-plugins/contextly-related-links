(function($) {

  Contextly.CssManager = Contextly.createClass({

    statics: {

      loadFile: function(url, key, callback) {
        var link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";

        if (typeof callback === 'function') {
          // Since there is no reliable cross-browser event, we set our handler
          // to the following list of events and use the first triggered:
          // - onload: should fire on modern browsers, see bug reports
          //   http://www.phpied.com/when-is-a-stylesheet-really-loaded/
          // - onreadystatechange: should fire on older IEs
          // - object.onload: for the rest we create an object pointing to the
          //   same URL and listen to its load event, see:
          //   http://www.phpied.com/preload-cssjavascript-without-execution/
          var onSuccess = function() {
            link.onload = null;
            link.onreadystatechange = null;
            $(obj).remove();
            if (timer !== null) {
              clearTimeout(timer);
              timer = null;
            }
            callback.call(link, key);
          };

          link.onload = onSuccess;
          link.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
              onSuccess();
            }
          };

          var timer = null;
          var obj = document.createElement('object');
          obj.width = 1;
          obj.height = 1;
          obj.type = 'text/css';
          obj.onload = function() {
            // Defer a bit, to let CSS arrive to the link tag and apply to the
            // document.
            timer = setTimeout(onSuccess, 10);
          };
          obj.data = url;

          $(obj)
            .css({
              position: 'absolute',
              top: 0,
              right: 0
            })
            .appendTo('body');
        }

        link.href = url;
        $(link)
          .attr({
            "data-ctx-key": key
          })
          .appendTo("head");
      },

      getFileElement: function(key) {
        return $('head link[data-ctx-key="' + Contextly.Utils.escapeSizzleAttrValue(key) + '"]');
      },

      removeFile: function(key) {
        this.getFileElement(key)
          .remove();
      },

      loadCode: function(code, key) {
        // IE 8 won't let us modify innerHTML property on STYLE tag and we
        // can't set it with .html() jQuery method.
        var html = '<style type="text/css"'
          + ' data-ctx-key="' + Contextly.Utils.escape(key) + '">'
          + Contextly.Utils.escape(code)
          + '</style>';

        $(html).appendTo('head');
      },

      getCodeElement: function(key) {
        return $('head style[data-ctx-key="' + Contextly.Utils.escapeSizzleAttrValue(key) + '"]');
      },

      removeCode: function(key) {
        this.getCodeElement(key)
          .remove();
      }

    }

  });

  Contextly.CssManager.broadcastTypes = {
    FILE_LOADING: 'contextlyCssFileLoading',
    FILE_LOADED: 'contextlyCssFileLoaded',
    FILE_REMOVED: 'contextlyCssFileRemoved',
    CODE_LOADED: 'contextlyCssCodeLoaded',
    CODE_REMOVED: 'contextlyCssCodeRemoved'
  };


})(jQuery);