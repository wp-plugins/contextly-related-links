(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.Base
   */
  Contextly.metadataParser.BaseSingleTag = Contextly.createClass({

    extend: Contextly.metadataParser.Base,

    statics: /** @lends Contextly.metadataParser.BaseSingleTag */ {

      /**
       * @function
       */
      findSource: Contextly.abstractMethod(),

      /**
       * @function
       */
      parseSource: Contextly.abstractMethod(),

      getSource: function() {
        if (typeof this.source === 'undefined') {
          this.source = this.findSource();
        }

        return this.source;
      },

      dataExists: function() {
        return !!this.getSource();
      },

      getData: function(key) {
        if (typeof this.data === 'undefined') {
          this.data = this.parseSource();
        }

        return this.data[key];
      },

      parseJson: function(text, fallback) {
        if (text) {
          try {
            return JSON.parse(text);
          }
          catch (e) {
            Contextly.Utils.logError('Unable to parse metadata', e);
          }
        }

        return fallback;
      }

    }

  });

})(jQuery);
