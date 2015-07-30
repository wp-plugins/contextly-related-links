(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseSingleTag
   * @extends Contextly.metadataParser.ForeignHelper
   */
  Contextly.metadataParser.ParselyPage = Contextly.createClass({

    extend: [Contextly.metadataParser.BaseSingleTag, Contextly.metadataParser.ForeignHelper],

    statics: /** @lends Contextly.metadataParser.ParselyPage */ {

      getPropertiesMap: function() {
        return {
          post_id: ['post_id'],
          type: ['type'],
          title: ['title'],
          image: ['image_url'],
          tags: ['tags'],
          url: ['link'],
          author_name: ['authors'],
          categories: ['section'],
          pub_date: ['pub_date']
        }
      },

      getConverters: function() {
        return {
          authors: this.convertToCommaSeparated,
          section: this.convertToArray,
          pub_date: this.convertDateIso8601,
          image_url: this.convertUrlToAbsolute,
          link: this.convertUrlToAbsolute
        };
      },

      findSource: function() {
        return $('meta[name="parsely-page"][content]:first')
          .attr('content');
      },

      parseSource: function() {
        var source = this.getSource();
        var raw = this.parseJson(source, {});
        return this.mapAll(raw);
      }

    }

  });

  Contextly.metadataFormats['ParselyPage'] = Contextly.metadataParser.ParselyPage;

})(jQuery);