(function($) {

  /**
   * Base class for all widgets displaying blocks.
   *
   * @class
   * @extends Contextly.widget.TextSnippet
   */
  Contextly.widget.BaseBlocksSnippet = Contextly.createClass( /** @lends Contextly.widget.BaseBlocksSnippet.prototype */ {

    extend: Contextly.widget.TextSnippet,

    getNumberOfLinksPerSection: function() {
      return 6;
    },

    getLinksHTMLOfType: function(type) {
      var html = "";
      var placeCounter = 0;
      var widget = this.widget;
      var links_limit = this.getNumberOfLinksPerSection();

      if (widget.links && widget.links[ type ]) {
        for (var link_idx in widget.links[ type ]) {
          var link = widget.links[ type ][ link_idx ];

          placeCounter++;
          if (placeCounter > links_limit) {
            break;
          }

          if (link.id && link.title) {
            html += this.getLinkHTML(link, placeCounter);
          }
        }
      }

      return html;
    },

    getWidgetHTML: function() {
      var div = "";

      div += "<div class='ctx-module " + this.getWidgetStyleClass() + " ctx-nodefs'>";

      var sections = this.widget.settings.display_sections;

      div += "<div class='ctx-sections-container ctx-nomar'>";
      for (var i = 0; i < sections.length; i++ ) {
        var section_name = sections[i];

        if (this.isDisplaySection(section_name)) {
          var section_key = section_name + '_subhead';
          var section_header = this.widget.settings[ section_key ];

          var section_classes = ['ctx-section', 'ctx-clearfix', 'ctx-section-' + section_name];
          div += "<div class='" + this.escape(section_classes.join(' ')) + "'>";

          if (section_header) {
            div += "<div class='ctx-links-header'><p class='ctx-nodefs'>" + this.escape(section_header) + "</p></div>";
          }

          div += "<div class='ctx-links-content ctx-nodefs ctx-clearfix'>";
          div += this.getLinksHTMLOfType(section_name);
          div += "</div></div>";
        }
      }
      div += "</div>";

      div += this.getBrandingButtonHtml();

      div += "</div>";

      return div;
    },

    getLinkHTML: function(link, linkCounter) {
      if (link.video) {
        return this.getLinkHTMLVideo(link, linkCounter);
      } else if (link.tweet) {
        return this.getLinkHTMLTweet(link, linkCounter);
      } else {
        return this.getLinkHTMLNormal(link, linkCounter);
      }
    },

    getLinkHTMLVideo: function(link, linkCounter) {
      return "<div class='ctx-link ctx-" + linkCounter + "'>" + this.getVideoLinkATag(link, this.getInnerLinkHTML(link)) + "</div>";
    },

    getLinkHTMLTweet: function(link, linkCounter) {
      return "<div class='ctx-link ctx-"  + linkCounter + "' data-tweet-id='" + this.escape(link.tweet) + "'>" + this.getTweetLinkATag(link, this.getInnerLinkHTML(link)) + "</div>";
    },

    getLinkHTMLNormal: function(link, linkCounter) {
      return "<div class='ctx-link ctx-" + linkCounter + "'>" + this.getLinkATag(link, this.getInnerLinkHTML(link)) + "</div>";
    },

    getHandlers: function(widgetHasData) {
      var handlers = Contextly.widget.TextSnippet.prototype.getHandlers.apply(this, arguments);

      if (widgetHasData) {
        handlers.queueTweetsRendering = true;
      }

      return handlers;
    }

  });

})(jQuery);
