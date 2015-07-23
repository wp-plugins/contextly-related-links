(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseSingleTag
   * @extends Contextly.metadataParser.ForeignHelper
   */
  Contextly.metadataParser.JsonLd = Contextly.createClass({

    extend: [Contextly.metadataParser.BaseSingleTag, Contextly.metadataParser.ForeignHelper],

    statics: /** @lends Contextly.metadataParser.JsonLd */ {

      getConverters: function() {
        return {
          creator: this.convertToCommaSeparated,
          founder: this.convertToCommaSeparated,
          dateCreated: this.convertDateIso8601,
          articleSection: this.convertToArray,
          thumbnailUrl: this.convertUrlToAbsolute,
          url: this.convertUrlToAbsolute
        };
      },

      getPropertiesMap: function() {
        return {
          post_id: ['articleId'],
          title: ['headline', 'description'],
          author_name: ['creator', 'founder'],
          image: ['thumbnailUrl'],
          pub_date: ['dateCreated'],
          categories: ['articleSection'],
          tags: ['keywords'],
          url: ['url']
        };
      },

      findSource: function() {
        var result = null;

        // We replicate the server side method. Find the first element with
        // headline/description and url properties.
        // TODO: Also check @context and @type.
        $('script[type="application/ld+json"]').each(function() {
          var text = $(this).html();
          try {
            var raw = JSON.parse(text);
            if ((raw.headline != null || raw.description != null) && raw.url != null) {
              result = raw;
              return false;
            }
          }
          catch (e) {
            Contextly.Utils.error('Unable to parse JSON LD element.');
          }
        });

        return result;
      },

      parseSource: function() {
        return this.mapAll(this.getSource());
      }

    }

  });

  Contextly.metadataFormats['JsonLD'] = Contextly.metadataParser.JsonLd;

})(jQuery);
