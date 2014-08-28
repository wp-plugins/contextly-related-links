(function($) {

  /**
   * @class
   * @extends Contextly.widget.BlocksSnippet
   */
  Contextly.widget.Blocks2Snippet = Contextly.createClass( /** @lends Contextly.widget.Blocks2Snippet.prototype */ {

    extend: Contextly.widget.BlocksSnippet,

    getWidgetStyleClass: function() {
      return 'ctx-content-block2';
    },

    getInnerLinkHTML: function(link, is_video) {
      var inner_html = "";

      if (this.getLinkThumbnailUrl(link)) {
        inner_html += "<div class='ctx-link-image'><img src='" + link.thumbnail_url + "' class='ctx-nodefs' /></div>";
      }
      inner_html += "<div class='ctx-link-title'><p class='ctx-nodefs'>"
        + this.getVideoIcon(is_video) + " " + link.title + "</p></div>";

      return inner_html;
    },

    getLinkHTMLVideo: function(link, linkCounter) {
      var linkClass = "";
      if (linkCounter > 3) {
        linkClass = " ctx-link-additional-" + linkCounter;
      }
      return "<div class='ctx-link" + linkClass + "'>" + this.getVideoLinkATag(link, this.getInnerLinkHTML(link, true)) + "</div>";
    },

    getCustomCssCode: function() {
      return Contextly.widget.Blocks2CssCustomBuilder
        .buildCSS('.ctx-module-container', this.getSettings());
    }

  });

})(jQuery);