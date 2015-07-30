(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.DublinCore
   */
  Contextly.metadataParser.WHO = Contextly.createClass({

    extend: Contextly.metadataParser.DublinCore,

    statics: /** @lends Contextly.metadataParser.WHO */ {

      getPropertiesMap: function() {
        var map = Contextly.metadataParser.DublinCore.getPropertiesMap.apply(this, arguments);
        map.post_id = ['webit_document_id'];
        return map;
      },

      dataExists: function() {
        return this.getData('post_id') != null;
      }

    }

  });

  // Erase the rest formats from the detection list.
  Contextly.metadataFormats = {};
  Contextly.metadataFormats['WHO'] = Contextly.metadataParser.WHO;

})(jQuery);