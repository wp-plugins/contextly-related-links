(function($) {

  /**
   * @class
   * @extends Contextly.widget.BaseLinksList
   */
  Contextly.widget.Sidebar = Contextly.createClass( /** @lends Contextly.widget.Sidebar.prototype */ {

    extend: Contextly.widget.BaseLinksList,

    construct: function(widget) {
      Contextly.widget.BaseLinksList.apply(this, arguments);

      this.widget_type = Contextly.widget.types.SIDEBAR;
      this.widget_html_id = 'contextly-' + widget.id;
    },

    getWidgetContainerClass: function() {
      return 'ctx-sidebar-container--' + this.getWidget().id;
    },

    getWidgetStyleClass: function() {
      return 'ctx-content-sidebar';
    },

    getWidgetHTML: function() {
      var html = '';

      var title = this.widget.name;
      if (title) {
        html += "<div class='ctx-sb-title'><p>" + this.escape(title) + "</p></div>";
      }

      var description = this.widget.description;
      if (description) {
        html += "<div class='ctx-sb-description'><p>" + this.escape(description) + "</p></div>";
      }

      html += "<div class='ctx-sb-content'>"
        + this.getLinksHTMLOfType('previous')
        + "</div>";

      var classes = [
        'ctx-sidebar',
        this.getWidgetStyleClass(),
        'ctx-sidebar-' + this.widget.layout,
        'ctx-clearfix'
      ];
      return "<div class='" + this.escape(classes.join(' ')) + "'>" + html + "</div>";
    },

    getLinkATag: function(link, content) {

      return "<a href=\"" +
        this.escape(link.native_url) + "\" title=\"" +
        this.escape(link.title) + "\" class='ctx-clearfix ctx-nodefs ctx-no-images' " +
        this.getEventTrackingHtml(link) + ">" + content + "</a>";
    },

    getLinkHTML: function(link) {
      var html = '';

      if (link.thumbnail_url) {

        var image_html = "<img src='" + link.thumbnail_url + "' />";
        var image_href;

        if (link.video) {
          image_href = this.getVideoLinkATag(link, image_html);
        }
        else {
          image_href = this.getLinkATag(link, image_html);
        }

        html += "<div class='ctx-sb-img'>" + image_href + "</div>";
      }

      var linkContent = link.title;
      if (!link.thumbnail_url) {
        linkContent = '<span class="ctx-icon ctx-bullet"></span>' + linkContent;
      }
      if (this.widget.settings.display_link_dates && link.publish_date) {
        linkContent += "<br /><span class='ctx-pub-date'>" + Contextly.Utils.dateTextDiff(link.publish_date) + "</span>";
      }

      var a;
      if (link.video) {
        a = this.getVideoLinkATag(link, linkContent);
      }
      else {
        a = this.getLinkATag(link, linkContent);
      }

      var classes = ['ctx-sb-text'];
      if (!link.thumbnail_url) {
        classes.push('ctx-sb-no-thumbnail');
      }
      html += "<div class='" + classes.join(' ') + "'><p>" + a + "</p></div>";

      html = "<div class='ctx-sb-fotmater ctx-clearfix'>" + html + "</div>";
      return html;
    },

    getLinksHTMLOfType: function(type) {
      var html = "";
      if (this.widget && this.widget.links && this.widget.links[ type ]) {
        for (var link_idx in this.widget.links[ type ]) {
          var link = this.widget.links[ type ][ link_idx ];

          if (link.id && link.title) {
            html += "<div class='ctx-sb-link'>" + this.getLinkHTML(link) + "</div>";
          }
        }
      }

      return html;
    },

    getAssetsPackageName: function() {
      return 'widgets/sidebar/default';
    },

    getCustomCssCode: function() {
      return Contextly.widget.SidebarCssCustomBuilder
        .buildCSS('.ctx-sidebar-container', this.getSettings());
    },

    getLayoutModes: function() {
      return {
        "mobile": [0, 200],
        "default": [200]
      };
    },

    checkLayoutThresholds: function() {
      // TODO Avoid hard-coding screen condition.
      if (this.getScreenWidth() <= 540) {
        var elements = this.getWidgetElements();
        this.eachElement(elements, function(element) {
          this.setLayoutMode(element, 'mobile');
        });
      }
      else {
        Contextly.widget.BaseLinksList.fn.checkLayoutThresholds.apply(this, arguments);
      }
    },

    buildLayoutClass: function(mode) {
      return 'ctx-sidebar-' + mode;
    }

  })

})(jQuery);
