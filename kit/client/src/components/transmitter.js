(function($) {

  /**
   * @class
   */
  Contextly.Transmitter = Contextly.createClass( /** @lends Contextly.Transmitter.prototype */ {

    /**
     *
     * @param type
     * @param {...*}
     *   The rest arguments are passed to the handler.
     */
    broadcast: function(type) {
      var args = Array.prototype.slice.call(arguments, 1);
      $(window).triggerHandler(type, args);
    }

  });

})(jQuery);