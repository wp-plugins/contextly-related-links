(function($) {

  /**
   * @class
   * @extends Contextly.widget.BaseBlocksSnippet
   */
  Contextly.widget.BlocksSnippet = Contextly.createClass( /** @lends Contextly.widget.BlocksSnippet.prototype */ {

    extend: Contextly.widget.BaseBlocksSnippet,

    getHandlers: function(widgetHasData) {
      var handlers = Contextly.widget.BaseBlocksSnippet.fn.getHandlers.apply(this, arguments);

      if (widgetHasData) {
        handlers.attachLinksHover = true;
      }

      return handlers;
    },

    attachLinksHover: function() {
      this.getWidgetElements()
        .find('.ctx-link')
        .bind('mouseenter', this.proxy(this.onLinkMouseEnter, true, true))
        .bind('mouseleave', this.proxy(this.onLinkMouseLeave, true, true));
    },

    onLinkMouseEnter: function(element) {
      var link = $(element);
      var p = link
        .find('.ctx-link-title p')
        .stop(true, true);

      var startHeight = p.height();
      link.addClass('ctx-expanded');
      var endHeight = p.height();
      if (endHeight <= startHeight) {
        link.removeClass('ctx-expanded');
        return;
      }

      p
        .css('height', startHeight)
        .animate({
          height: endHeight
        }, {
          duration: 200,
          complete: function() {
            p.css('height', 'auto');
          }
        });
    },

    onLinkMouseLeave: function(element) {
      var link = $(element);
      var p = link
        .find('.ctx-link-title p')
        .stop(true, true);

      if (!link.is('.ctx-expanded')) {
        return;
      }

      var startHeight = p.height();
      link.removeClass('ctx-expanded');
      var endHeight = p.height();
      link.addClass('ctx-expanded');

      p
        .css('height', startHeight)
        .animate({
          height: endHeight
        }, {
          duration: 200,
          complete: function() {
            p.css('height', '');
            link.removeClass('ctx-expanded');
          }
        });
    },

    getInnerLinkHTML: function(link) {
      var inner_html = "<div class='ctx-link-title'>" +
        "<p class='ctx-nodefs'>" + this.getLinkIcon(link) + " " + link.title + "</div>";
      if (this.getLinkThumbnailUrl(link)) {
        inner_html += "<div class='ctx-link-image'><img src='" + link.thumbnail_url + "' class='ctx-nodefs' /></div>";
      }

      return inner_html;
    },

    getWidgetStyleClass: function() {
      return 'ctx-content-block';
    },

    getCustomCssCode: function() {
      return Contextly.widget.BlocksCssCustomBuilder
        .buildCSS('.ctx-module-container', this.getSettings());
    },

    getLayoutModes: function() {
      return {
        "mobile": [0, 200],
        "tablet": [200, 450],
        "default": [450, 650],
        "sec5": [650, 790],
        "sec6": [790]
      };
    }

  });

})(jQuery);
