(function($) {

  Contextly.metadataParser = Contextly.metadataParser || {};

  Contextly.metadataParser.Base = Contextly.createClass({

    statics: /** @lends Contextly.metadataParser.Base */ {

      /**
       * @function
       */
      dataExists: Contextly.abstractMethod(),

      /**
       * @function
       * @param {string} key
       */
      getData: Contextly.abstractMethod(),

      /**
       * @function
       * @param {string} key
       * @returns {number}
       */
      getCount: function(key) {
        var data = this.getData(key);
        if (Contextly.Utils.isArray(data) && data.length) {
          return data.length;
        }
        else {
          return 0;
        }
      }

    }

  });

})(jQuery);
