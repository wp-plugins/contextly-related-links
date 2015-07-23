(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseMultiTag
   * @extends Contextly.metadataParser.ForeignHelper
   */
  Contextly.metadataParser.OpenGraph = Contextly.createClass({

    extend: [Contextly.metadataParser.BaseMultiTag, Contextly.metadataParser.ForeignHelper],

    statics: /** @lends Contextly.metadataParser.OpenGraph */ {

      getPropertiesMap: function() {
        return {
          title: ['og:title'],
          image: ['og:image'],
          mod_date: ['article:modified_time'],
          pub_date: ['article:published_time'],
          tags: ['article:tag'],
          categories: ['article:section'],
          url: ['og:url']
        };
      },

      getConverters: function() {
        return {
          "article:modified_time": this.convertDateIso8601,
          "article:published_time": this.convertDateIso8601,
          "article:tag": this.convertToArray,
          "article:section": this.convertToArray,
          "og:image": this.convertUrlToAbsolute,
          "og:url": this.convertUrlToAbsolute
        };
      },

      getTags: function(sourceKey) {
        var selector = 'meta[property="' + sourceKey + '"][content]';

        // Multiple tags should only be found for tags.
        if (sourceKey !== 'article:tag') {
          selector += ':first';
        }

        return $(selector);
      },

      getTagValue: function(sourceKey, tag) {
        return tag.attr('content');
      }

    }

  });

  Contextly.metadataFormats['OG'] = Contextly.metadataParser.OpenGraph;

})(jQuery);