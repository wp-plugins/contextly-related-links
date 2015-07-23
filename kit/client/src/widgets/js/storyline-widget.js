(function($) {

  /**
   * @class
   * @extends Contextly.widget.Base
   */
  Contextly.widget.StoryLineSubscribe = Contextly.createClass( /** @lends Contextly.widget.StoryLineSubscribe.prototype */ {

    extend: Contextly.widget.Base,

    construct: function(widget) {
      this.widget = widget;
      this.widget_type = Contextly.widget.types.STORYLINE_SUBSCRIBE;
      this.widget_html_id = 'ctx-sl-subscribe';
    },

    getWidgetContainerClass: function() {
      return 'ctx-subscribe-container';
    },

    getWidgetLogo: function() {
      var s = this.getSettings();

      var iconClasses = ['ctx-subscribe-logo'];
      if (s.css.logo === 'single-color') {
        iconClasses.push('ctx-icon', 'ctx-icon-logo');
      }
      else {
        iconClasses.push('ctx-image-logo');
      }
      return '<i class="' + this.escape(iconClasses.join(' ')) + '"></i>';
    },

    getWidgetLabel: function() {
      return '<span class="ctx-subscribe-label">'
        + this.escape(this.getSettings().title)
        + '</span>'
    },

    getWidgetHTML: function() {
      var s = this.getSettings();

      var linkClasses = ['ctx-subscribe-link', this.getWidgetStyleClass()];
      linkClasses.push('ctx-height-' + (s.css.height || 'middle'));
      if (s.css.button_shadow) {
        linkClasses.push('ctx-box-shadow');
      }
      if (s.css.text_shadow) {
        linkClasses.push('ctx-text-shadow');
      }

      return '<a href="javascript:" class="' + this.escape(linkClasses.join(' ')) + '">'
        + '<span class="ctx-subscribe-row">'
        + this.getWidgetLogo()
        + this.getWidgetLabel()
        + '</span>'
        + '</a>';
    },

    attachStoryLineButtonHandler: function() {
      this.getWidgetContainers()
        .find('.ctx-subscribe-link')
        .click(this.proxy(this.displayStoryLinePopup, false, true));
    },

    displayStoryLinePopup: function (e) {
      e.preventDefault();

      Contextly.overlay.StoryLineSubscribe.open({
        email_confirmed: this.widget.email_confirmed,
        subscribe_newsletter: this.widget.settings.subscribe_newsletter,
        subscribe_newsletter_title: this.widget.settings.subscribe_newsletter_title
      });
    },

    getCustomCssCode: function() {
      var entry = {
        container: '.' + this.getWidgetContainerClass(),
        widget: '.' + this.getWidgetContainerClass() + ' .ctx-subscribe-link.' + this.getWidgetStyleClass()
      };
      return Contextly.widget.StorylineSubscribeCssCustomBuilder.buildCSS(entry, this.getSettings());
    },

    getWidgetStyleClass: function() {
      var theme = this.getSettings().theme || 'transparent';
      return 'ctx-theme-' + theme;
    },

    suppressTransitions: function() {
      var containers = this.getWidgetContainers();

      var selector;
      if (this.getSettings().theme === 'split-button') {
        selector = '.ctx-subscribe-label, .ctx-subscribe-logo';
      }
      else {
        selector = '.ctx-subscribe-link';
      }

      var suppressed = containers
        .find(selector)
        .addClass('ctx-no-transitions');
      setTimeout(function() {
        suppressed.removeClass('ctx-no-transitions');
      }, 1);
    },

    getAssetsPackageName: function() {
      return 'widgets/storyline/' + this.getSettings().theme;
    },

    display: function() {
      var widget_html = this.getWidgetHTML();
      this.displayHTML(widget_html);
      this.suppressTransitions();
      this.attachHandlers();
      this.broadcastWidgetDisplayed();
    },

    getHandlers: function() {
      var handlers = Contextly.widget.Base.prototype.getHandlers.apply(this, arguments);

      handlers.attachStoryLineButtonHandler = true;

      return handlers;
    }

  });

})(jQuery);
