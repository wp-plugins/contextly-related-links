(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.BaseSingleTag
   */
  Contextly.metadataParser.Default = Contextly.createClass({

    extend: Contextly.metadataParser.BaseSingleTag,

    statics: /** @lends Contextly.metadataParser.Default */ {

      findSource: function() {
        return $('meta[name="contextly-page"][content]:first')
          .attr('content');
      },

      parseSource: function() {
        return this.parseJson(this.getSource(), {});
      }

    }

  });

})(jQuery);
