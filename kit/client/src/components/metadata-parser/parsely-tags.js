(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseMultiTag
   * @extends Contextly.metadataParser.ForeignHelper
   */
  Contextly.metadataParser.ParselyTags = Contextly.createClass({

    extend: [Contextly.metadataParser.BaseMultiTag, Contextly.metadataParser.ForeignHelper],

    statics: /** @lends Contextly.metadataParser.ParselyTags */ {

      getPropertiesMap: function() {
        return {
          post_id: ['post-id'],
          type: ['type'],
          title: ['title'],
          author_name: ['author'],
          image: ['image-url'],
          pub_date: ['pub-date'],
          categories: ['section'],
          tags: ['tags'],
          url: ['link']
        };
      },

      getConverters: function() {
        return {
          "pub-date": this.convertDateIso8601,
          "section": this.convertToArray,
          "tags": this.convertSplitByComma,
          "image-url": this.convertUrlToAbsolute,
          "link": this.convertUrlToAbsolute
        };
      },

      getTags: function(sourceKey) {
        return $('meta[name="parsely-' + sourceKey + '"][content]:first');
      },

      getTagValue: function(sourceKey, tag) {
        return tag.attr('content');
      }

    }

  });

  Contextly.metadataFormats['ParselyData'] = Contextly.metadataParser.ParselyTags;

})(jQuery);