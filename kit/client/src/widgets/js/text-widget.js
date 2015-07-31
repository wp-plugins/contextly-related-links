(function($) {

  /**
   * @class
   * @extends Contextly.widget.BaseLinksList
   */
  Contextly.widget.TextSnippet = Contextly.createClass( /** @lends Contextly.widget.TextSnippet.prototype */ {

    extend: Contextly.widget.BaseLinksList,

    construct: function(widget) {
      Contextly.widget.BaseLinksList.apply(this, arguments);

      this.widget_type = Contextly.widget.types.SNIPPET;
      this.widget_html_id = 'ctx-module';
    },

    getWidgetContainerClass: function() {
      return 'ctx-module-container';
    },

    getAssetsPackageName: function() {
      return 'widgets/snippet/' + this.getSettings().display_type;
    },

    getWidgetStyleClass: function() {
      return 'ctx-content-text';
    },

    getWidgetHTML: function() {
      var div = "";

      var sections = this.widget.settings.display_sections;

      div += "<div class='ctx-module " + this.getWidgetStyleClass() + " ctx-nodefs'>";
      div += "<div class='ctx-sections-container ctx-clearfix'>";

      for (var i = 0; i < sections.length; i++ ) {
        var section_name = sections[i];

        if (this.isDisplaySection(section_name)) {
          var section_key = section_name + '_subhead';
          var section_header = this.widget.settings[ section_key ];
          var section_classes = ['ctx-section', 'ctx-section-' + this.escape(section_name)];

          // Mark single column on the row with a special class.
          if (i % 2 === 0 && i + 1 === sections.length) {
            section_classes.push('ctx-wide');
          }

          div += "<div class='" + section_classes.join(' ') + "'>";

          if (section_header) {
            div += "<div class='ctx-links-header'><p class='ctx-nodefs'>" + this.escape(section_header) + "</p></div>";
          }

          div += "<div class='ctx-links-content'>" + this.getLinksHTMLOfType(section_name) + "</div>";
          div += "</div>";
        }
      }
      div += "</div>";
      div += "</div>";

      div += this.getBrandingButtonHtml();

      return div;
    },

    getLinksHTMLOfType: function(type) {
      var html = "";
      var widget = this.widget;

      if (widget.links && widget.links[ type ]) {
        for (var link_idx in widget.links[ type ]) {
          var link = widget.links[ type ][ link_idx ];

          if (link.id && link.title) {
            html += this.getLinkHTML(link);
          }
        }
      }

      return html;
    },

    getInnerLinkHTML: function(link) {
      var icon = this.getLinkIcon(link);
      if (icon === '') {
        icon = '<span class="ctx-icon ctx-bullet"></span>';
      }

      return icon + link.title;
    },

    getHandlers: function(widgetHasData) {
      var handlers = Contextly.widget.BaseLinksList.fn.getHandlers.apply(this, arguments);

      if (widgetHasData) {
        handlers.attachLinksPopups = true;
        handlers.attachBrandingHandlers = true;

        if (!Contextly.Settings.isAdmin()) {
          handlers.attachWidgetViewHandler = true;
        }
      }

      return handlers;
    },

    getCustomCssCode: function() {
      return Contextly.widget.TextCssCustomBuilder
        .buildCSS('.ctx-module-container', this.getSettings());
    },

    buildLayoutClass: function(mode) {
      return 'ctx-module-' + mode;
    },

    getLayoutModes: function() {
      return {
        "mobile": [0, 450],
        "default": [450]
      }
    }

  });

})(jQuery);
