(function($) {

  /**
   * @class
   * @extends Contextly.overlay.Base
   *
   * Base overlay with re-usable dialog, but with dynamic content inside it.
   */
  Contextly.overlay.Dynamic = Contextly.createClass({

    extend: Contextly.overlay.Base,

    statics: /** @lends Contextly.overlay.Dynamic */ {

      /**
       * @function
       */
      getDialogHtml: Contextly.abstractMethod(),

      renderDialog: function(data) {
        if (!this.dialog) {
          var html = this.getDialogHtml();
          this.dialog = $(html)
            .appendTo('body');
        }
        else {
          this.dialog.show();
        }

        this.renderContent(data);
      },

      destroyDialog: function() {
        this.destroyContent();
        this.dialog.hide();
      },

      /**
       * @function
       *
       * @param data
       */
      renderContent: Contextly.abstractMethod(),

      /**
       * @function
       */
      destroyContent: Contextly.abstractMethod()

    }

  });

})(jQuery);