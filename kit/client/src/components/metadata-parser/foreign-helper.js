(function($) {

  /**
   * @class
   */
  Contextly.metadataParser.ForeignHelper = Contextly.createClass({

    statics: /** @lends Contextly.metadataParser.ForeignHelper */ {

      construct: function() {
        this.converters = this.getConverters();
        this.propertiesMap = this.getPropertiesMap();
      },

      getConverters: function() {
        return {};
      },

      getPropertiesMap: function() {
        return {};
      },

      /**
       * @param key
       * @param raw
       * @param [fallback]
       */
      map: function(key, raw, fallback) {
        if (typeof this.propertiesMap[key] !== 'undefined') {
          for (var i = 0; i < this.propertiesMap[key].length; i++) {
            var src = this.propertiesMap[key][i];
            var value = this.convert(src, raw[src]);
            if (typeof value !== 'undefined') {
              return value;
            }
          }
        }

        return fallback;
      },

      mapAll: function(raw, fallback) {
        var data = {};

        for (var key in this.propertiesMap) {
          var value = this.map(key, raw, fallback);
          if (typeof value !== 'undefined') {
            data[key] = value;
          }
        }

        return data;
      },

      convert: function(key, value) {
        if (value == null) {
          return;
        }

        if (this.converters[key] == null) {
          return value;
        }

        return this.converters[key](value);
      },

      convertToArray: function(value) {
        if (Contextly.Utils.isArray(value)) {
          return value;
        }
        else {
          return [value];
        }
      },

      convertToCommaSeparated: function(value) {
        if (Contextly.Utils.isArray(value)) {
          if (value.length) {
            return value.join(', ');
          }
        }
        else {
          return value;
        }
      },

      convertDateIso8601: function(value) {
        var parsed = value.match(/^(\d+\-\d+\-\d+)T(\d+:\d+:\d+)?/);
        if (!parsed) {
          return;
        }

        var result = parsed[1] + ' ';
        if (parsed.length >= 2) {
          result += parsed[2];
        }
        else {
          result += '12:00:00';
        }
        return result;
      },

      convertSplitByComma: function(value) {
        if (Contextly.Utils.isArray(value)) {
          if (value.length) {
            return value;
          }
        }
        else {
          return value.split(/\s*,\s*/);
        }
      },

      convertUrlToAbsolute: function(value) {
        if (!value) {
          return;
        }

        // Run URL through the A tag and re-construct absolute URL.
        var a = document.createElement('a');
        a.href = value;
        return a.protocol + '//' + a.host + a.pathname + a.search + a.hash;
      }

    }

  });

})(jQuery);
