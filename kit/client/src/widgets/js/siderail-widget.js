(function($) {

  /**
   * @class
   * @extends Contextly.widget.BaseLinksList
   */
  Contextly.widget.Siderail = Contextly.createClass( /** @lends Contextly.widget.Siderail.prototype */ {

    extend: Contextly.widget.BaseLinksList,

    construct: function(widget) {
      Contextly.widget.BaseLinksList.apply(this, arguments);

      this.widget_type = Contextly.widget.types.SIDERAIL;
    },

    getWidgetContainerClass: function() {
      return 'ctx-siderail-container';
    },

    getWidgetStyleClass: function() {
      return 'ctx-siderail-' + this.getSettings().theme;
    },

    getWidgetHTML: function() {
      var html = '';
      var s = this.getSettings();

      if (s.title) {
        html += "<div class='ctx-sr-title'><p>" + this.escape(s.title) + "</p></div>";
      }

      html += "<div class='ctx-sr-content'>"
        + this.getLinksHTML()
        + "</div>";

      var classes = [
        'ctx-siderail',
        this.getWidgetStyleClass()
      ];
      return "<div class='" + this.escape(classes.join(' ')) + "'>" + html + "</div>";
    },

    getLinkATag: function(link, content) {
      return "<a href=\"" +
        this.escape(link.native_url) + "\" title=\"" +
        this.escape(link.title) + "\" class='ctx-clearfix ctx-nodefs' " +
        this.getEventTrackingHtml(link) + ">" + content + "</a>";
    },

    getLinkHTML: function(link) {
      var link_content = "";

      if (link.thumbnail_url) {
        link_content = "<div class='ctx-link-image'><img class='ctx-nodefs' src='" + this.escape(link.thumbnail_url) + "' /></div>";
      }

      var title = link.title;
      var icon = this.getLinkIcon(link);
      if (icon) {
        title = icon + ' ' + title;
      }
      link_content += "<div class='ctx-link-title'><p class='ctx-nodefs'>" + title + "</p></div>";

      var a;
      if (link.video) {
        a = this.getVideoLinkATag(link, link_content);
      }
      else {
        a = this.getLinkATag(link, link_content);
      }

      var classes = ['ctx-link'];
      if (!link.thumbnail_url) {
        classes.push('ctx-no-thumbnail');
      }
      return "<div class='" + classes.join(' ') + "'>" + a + "</div>";
    },

    getLinksHTML: function() {
      var html = "";
      if (this.widget && this.widget.links) {
        for (var link_idx in this.widget.links) {
          var link = this.widget.links[link_idx];

          if (link.id && link.title) {
            html += this.getLinkHTML(link);
          }
        }
      }

      return html;
    },

    getHandlers: function(widgetHasData) {
      var handlers = Contextly.widget.BaseLinksList.prototype.getHandlers.apply(this, arguments);

      if (widgetHasData) {
        handlers.attachLinksPopups = true;
      }

      return handlers;
    },

    getAssetsPackageName: function() {
      return 'widgets/siderail/default';
    },

    getCustomCssCode: function() {
      return Contextly.widget.SiderailCssCustomBuilder
        .buildCSS('.' + this.getWidgetStyleClass(), this.getSettings());
    }

  })

})(jQuery);
