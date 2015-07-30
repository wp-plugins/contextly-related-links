(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.Base
   */
  Contextly.metadataParser.BaseMultiTag = Contextly.createClass({

    extend: Contextly.metadataParser.Base,

    statics: /** @lends Contextly.metadataParser.BaseMultiTag */ {

      /**
       * @function
       * @param {string} sourceKey
       */
      getTags: Contextly.abstractMethod(),

      /**
       * @function
       * @param {string} sourceKey
       * @param {jQuery} tag
       */
      getTagValue: Contextly.abstractMethod(),

      construct: function() {
        this.parsed = {};
        this.data = {};
      },

      dataExists: function() {
        // Make sure all required properties are present.
        var req = ['url', 'title'];
        for (var i = 0; i < req.length; i++) {
          if (typeof this.getData(req[i]) === 'undefined') {
            return false;
          }
        }
        return true;
      },

      getSourceValue: function(sourceKey) {
        var tags = this.getTags(sourceKey);
        if (!tags.length) {
          return;
        }

        if (tags.length == 1) {
          return this.getTagValue(sourceKey, tags);
        }
        else {
          var result = [];
          for (var i = 0; i < tags.length; i++) {
            var tagValue = this.getTagValue(sourceKey, tags.eq(i));
            if (tagValue != null) {
              result.push(tagValue);
            }
          }
          if (result.length) {
            return result;
          }
        }
      },

      getValue: function(key) {
        if (!this.propertiesMap[key]) {
          return;
        }

        for (var i = 0; i < this.propertiesMap[key].length; i++) {
          var src = this.propertiesMap[key][i];
          var candidate = this.getSourceValue(src);
          candidate = this.convert(src, candidate);
          if (candidate != null) {
            return candidate;
          }
        }
      },

      /**
       * @function
       * @param {string} key
       */
      getData: function(key) {
        if (!this.parsed[key]) {
          this.parsed[key] = true;

          var value = this.getValue(key);
          if (value != null) {
            this.data[key] = value;
          }
        }

        return this.data[key];
      }

    }

  });

})(jQuery);
