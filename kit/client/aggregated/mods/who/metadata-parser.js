(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.Base
   */
  Contextly.metadataParser.WHO = Contextly.createClass({

    extend: Contextly.metadataParser.Base,

    statics: /** @lends Contextly.metadataParser.WHO */ {

      construct: function() {
        this.data = {};
      },

      parseData: function(key) {
        var map = {
          post_id: 'webit_document_id',
          title: 'DC.title',
          pub_date: 'DC.date.published',
          url: 'DC.identifier'
        };
        if (!key in map) {
          return null;
        }

        var value = $('meta[name="' + map[key] + '"]').attr('content');

        // Add domain to the URL.
        if (key == 'url') {
          var location = document.location;
          value = location.protocol + '//' + location.host + value;
        }

        return value;
      },

      dataExists: function() {
        return this.getData('post_id') != null;
      },

      getData: function(key) {
        if (typeof this.data[key] === 'undefined') {
          this.data[key] = this.parseData(key);
        }

        return this.data[key];
      }

    }

  });

})(jQuery);