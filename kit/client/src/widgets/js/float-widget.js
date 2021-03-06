(function($) {

  /**
   * @class
   * @extends Contextly.widget.BaseBlocksSnippet
   */
  Contextly.widget.FloatSnippet = Contextly.createClass( /** @lends Contextly.widget.FloatSnippet.prototype */ {

    extend: Contextly.widget.BaseBlocksSnippet,

    getWidgetStyleClass: function() {
      return 'ctx-content-float';
    },

    getNumberOfLinksPerSection: function() {
      return this.getSettings().links_limit;
    },

    getInnerLinkHTML: function(link) {
      var inner_html = "";
      if (this.getLinkThumbnailUrl(link)) {
        inner_html += "<div class='ctx-link-image'><img src='" + link.thumbnail_url + "' class='ctx-nodefs' /></div>";
      }

      inner_html += "<div class='ctx-link-title'><p class='ctx-nodefs'>"
        + this.getLinkIcon(link) + " " + link.title + "</p></div>";

      return inner_html;
    },

    getCustomCssCode: function() {
      return Contextly.widget.FloatCssCustomBuilder
        .buildCSS('.ctx-module-container', this.getSettings());
    },

    getLayoutModes: function() {
      return {
        "mobile": [0, 240],
        "medium": [240, 400],
        "normal": [400, 700],
        "wide": [700]
      };
    }

  });

})(jQuery);
