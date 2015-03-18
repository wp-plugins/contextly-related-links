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

    getWidgetHTML: function() {
      return "<a href='javascript:' class='ctx-subscribe-link' class='ctx-nodefs'>"
        + "Get more stories like this"
        + "</a>";
    },

    attachStoryLineButtonHandler: function() {
      $('#ctx-sl-subscribe .ctx-subscribe-link').click(this.proxy(this.displayStoryLinePopup, false, true));
    },

    displayStoryLinePopup: function (e) {
      e.preventDefault();

      Contextly.RESTClient.call('storylines', 'button-click');
      Contextly.overlay.StoryLineSubscribe.open({
        subscribe_newsletter: this.widget.settings.subscribe_newsletter
      });
    },

    display: function() {
      Contextly.widget.Base.prototype.display.apply(this, arguments);

      this.attachStoryLineButtonHandler();
    }

  });

})(jQuery);
