(function($) {

  /**
   * @class
   * @extends Contextly.widget.BlocksSnippet
   */
  Contextly.widget.FloatSnippet = Contextly.createClass( /** @lends Contextly.widget.FloatSnippet.prototype */ {

    extend: Contextly.widget.BlocksSnippet,

    getWidgetStyleClass: function() {
      return 'ctx-content-float';
    },

    getNumberOfLinksPerSection: function() {
      return this.getSettings().links_limit;
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
      return Contextly.widget.FloatCssCustomBuilder
        .buildCSS('.ctx-module-container', this.getSettings());
    }

  });

})(jQuery);