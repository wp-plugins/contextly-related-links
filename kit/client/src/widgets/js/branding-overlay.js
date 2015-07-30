(function($) {

  /**
   * @class
   * @extends Contextly.overlay.Base
   */
  Contextly.overlay.Branding = Contextly.createClass({

    extend: Contextly.overlay.Base,

    statics: /** @lends Contextly.overlay.Branding */ {

      open: function(options) {
        Contextly.overlay.Base.open.call(this, null, options);
      },

      renderOverlay: function() {
        var init = Contextly.overlay.Base.renderOverlay.apply(this, arguments);
        if (init) {
          this.overlay.addClass('ctx-brd-overlay');
        }
      },

      renderDialog: function() {
        if (!this.dialog) {
          var content = '<div id="ctx-branding-content" class="ctx-overlay-dialog">';
          content += '<div id="ctx-brd-modal">';
          content += '<div id="ctx-brd-logo"></div>';
          content += '<div id="ctx-brd-text-head"></div>';
          content += '<div id="ctx-brd-text"><p>Contextly recommends interesting and related stories using a unique combination of algorithms and editorial choices.<br><br>Publishers or advertisers who would like to learn more about Contextly can contact us&nbsp;<a href="http://contextly.com/sign-up/publishers/" target="_blank">here</a>.<br><br>We respect <a href="http://contextly.com/privacy/" target="_blank">readers&#8217; privacy </a>.&nbsp;</p></div>';
          content += '</div>';
          content += '<a href="javascript:" id="ctx-brd-close">X</a>';
          content += '</div>';

          this.dialog = $(content)
            .appendTo('body');
        }
        else {
          this.dialog.show();
        }
      },

      destroyDialog: function() {
        this.dialog.hide();
      },

      bindHandlers: function() {
        Contextly.overlay.Base.bindHandlers.apply(this, arguments);

        $("#ctx-brd-close").bind(this.ns('click'), this.proxy(this.close));
      },

      unbindHandlers: function() {
        Contextly.overlay.Base.unbindHandlers.apply(this, arguments);

        $("#ctx-brd-close").unbind(this.ns('click'));
      }

    }

  });



})(jQuery);