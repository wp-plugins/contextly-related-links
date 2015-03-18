(function($) {

  // Init global namespace.
  Contextly.widget = Contextly.widget || {};

  // Widget types.
  Contextly.widget.types = {
    SNIPPET: 'snippet',
    SIDEBAR: 'sidebar',
    AUTO_SIDEBAR: 'auto-sidebar',
    STORYLINE_SUBSCRIBE: 'storyline-subscribe'
  };

  // Snippet styles.
  Contextly.widget.styles = {
    TEXT: 'default',
    TABS: 'tabs',
    BLOCKS: 'blocks',
    BLOCKS2: 'blocks2',
    FLOAT: 'float'
  };

  // Widget link types.
  Contextly.widget.linkTypes = {
    PREVIOUS: 'previous',
    RECENT: 'recent',
    WEB: 'web',
    INTERESTING: 'interesting',
    CUSTOM: 'custom',
    PROMO: 'sticky'
  };

  // Widget recommendation types.
  Contextly.widget.recommendationTypes = {
    VIDEO: 10,
    PRODUCT: 9,
    COOKIE: 8,
    EVERGREEN: 7,
    OPTIMIZATION: 6
  };

  // Widget-related broadcast event types.
  Contextly.widget.broadcastTypes = {
    DISPLAYED: 'contextlyWidgetDisplayed'
  };

  /**
   * Base abstract class for all widgets.
   *
   * @class
   * @extends Contextly.Proxy
   */
  Contextly.widget.Base = Contextly.createClass( /** @lends Contextly.widget.Base.prototype */ {

    extend: Contextly.Proxy,

    // TODO Replace with template rendering and drop.
    abstracts: [ 'getWidgetHTML' ],

    getDisplayElement: function() {
      return $('#' + this.widget_html_id);
    },

    // TODO Replace use cases with template and drop.
    displayHTML: function (html) {
      this.getDisplayElement().html(html);
    },

    // TODO Replace use cases with template and drop.
    appendHTML: function(html) {
      this.getDisplayElement().append(html);
    },

    display: function() {
      var widget_html = this.getWidgetHTML();
      this.displayHTML(widget_html);
      this.broadcastWidgetDisplayed();
    },

    broadcastWidgetDisplayed: function() {
      var type = Contextly.widget.broadcastTypes.DISPLAYED;
      $(window).triggerHandler(type, [this.widget_type, this]);
    },

    // TODO Check if any use cases left after moving to templates and drop.
    escape: function(text) {
      return Contextly.Utils.escape(text);
    }

  });

})(jQuery);
