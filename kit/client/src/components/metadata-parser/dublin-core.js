(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseMultiTag
   * @extends Contextly.metadataParser.ForeignHelper
   */
  Contextly.metadataParser.DublinCore = Contextly.createClass({

    extend: [Contextly.metadataParser.BaseMultiTag, Contextly.metadataParser.ForeignHelper],

    statics: /** @lends Contextly.metadataParser.DublinCore */ {

      getPropertiesMap: function() {
        return {
          title: ['DC.title'],
          author_name: ['DC.publisher'],
          pub_date: ['DC.date.published'],
          url: ['DC.identifier']
        };
      },

      getConverters: function() {
        return {
          "DC.identifier": this.convertUrlToAbsolute
        };
      },

      getTags: function(sourceKey) {
        return $('meta[name="' + sourceKey + '"][content]:first');
      },

      getTagValue: function(sourceKey, tag) {
        return tag.attr('content');
      }

    }

  });

  Contextly.metadataFormats['DC'] = Contextly.metadataParser.DublinCore;

})(jQuery);