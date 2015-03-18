(function($) {

  /**
   * @class
   * @extends Contextly.overlay.Default
   */
  Contextly.overlay.Editor = Contextly.createClass({

    extend: Contextly.overlay.Default,

    statics: /** @lends Contextly.overlay.Editor */ {

      renderContent: function(url) {
        this.content = $('<iframe frameBorder="0" class="ctx-editor-overlay-iframe" />')
          .attr({
            src: url,
            width: '100%',
            height: '100%'
          })
          .prependTo(this.dialog);
      },

      getDefaultOptions: function() {
        var options = Contextly.overlay.Base.getDefaultOptions.apply(this, arguments);

        options = $.extend(true, options, {
          width: {
            value: 'window',
            max: 1400
          },
          height: {
            value: 'window'
          },
          closeOnEsc: false,
          closeOnOverlayClick: false
        });

        return options;
      }

    }

  });

})(jQuery);
