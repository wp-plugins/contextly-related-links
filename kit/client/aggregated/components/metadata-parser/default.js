(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.Base
   */
  Contextly.metadataParser.Default = Contextly.createClass({

    extend: Contextly.metadataParser.Base,

    statics: /** @lends Contextly.metadataParser.Default */ {

      findElement: function() {
        return $('head meta[name="contextly-page"][content]');
      },

      getElement: function() {
        if (typeof this.element === 'undefined') {
          this.element = this.findElement();
        }

        return this.element;
      },

      dataExists: function() {
        return !!this.getElement().length;
      },

      parseData: function() {
        var data = {};

        var json = this.getElement()
          .attr('content');
        if (json) {
          try {
            data = JSON.parse(json);
          }
          catch (e) {
            Contextly.Utils.logError('Unable to parse Contextly metadata', e);
          }
        }

        return data;
      },

      getData: function(key) {
        if (typeof this.data === 'undefined') {
          this.data = this.parseData();
        }

        return this.data[key];
      }

    }

  });

})(jQuery);
