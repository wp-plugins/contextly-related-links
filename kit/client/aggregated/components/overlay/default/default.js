(function($) {

  Contextly.overlay.Default = Contextly.createClass({

    extend: Contextly.overlay.Base,

    statics: /** @lends Contextly.overlay.Default */ {

      renderOverlay: function() {
        var init = Contextly.overlay.Base.renderOverlay.apply(this, arguments);
        if (init) {
          this.overlay.addClass('ctx-default-overlay');
        }
      },

      renderDialog: function(element) {
        if (!this.dialog) {
          this.dialog = $('<div class="ctx-overlay-dialog ctx-default-overlay-dialog" />')
            .appendTo('body');

          this.closeButton = $('<a href="javascript:" class="ctx-default-overlay-close"></a>')
            .appendTo(this.dialog);
        }
        else {
          this.dialog.show();
        }

        this.renderContent(element);
      },

      renderContent: function(element) {
        this.content = element.appendTo(this.dialog);
      },

      destroyDialog: function() {
        this.destroyContent();
        this.dialog.hide();
      },

      destroyContent: function() {
        this.content.remove();
        delete this.content;
      },

      bindHandlers: function() {
        Contextly.overlay.Base.bindHandlers.apply(this, arguments);

        this.closeButton.bind(this.ns('click'), this.proxy(this.close));
      },

      unbindHandlers: function() {
        Contextly.overlay.Base.unbindHandlers.apply(this, arguments);

        this.closeButton.unbind(this.ns('click'));
      }

    }

  });

})(jQuery);