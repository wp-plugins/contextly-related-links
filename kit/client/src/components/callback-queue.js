(function() {

  /**
   * Tool to wait for multiple events/callbacks to fire.
   */
  Contextly.CallbackQueue = Contextly.createClass({

    extend: Contextly.Proxy,

    construct: function() {
      this.left = 0;
      this.lastId = 0;
      this.reasons = {};
      this.results = [];
    },

    addReason: function(callback) {
      var id = ++this.lastId;

      var reason;
      if (typeof callback !== 'undefined') {
        reason = this.proxy(function(context) {
          var args = Array.prototype.slice.call(arguments, 1);
          callback.apply(context, args);
          this.onReasonAppeared(id);
        }, true, true);
      }
      else {
        reason = this.proxy(function() {
          this.onReasonAppeared(id);
        });
      }

      this.reasons[id] = false;
      this.left++;

      return reason;
    },

    onReasonAppeared: function(id) {
      if (this.reasons[id]) {
        return;
      }

      this.reasons[id] = true;
      this.left--;
      this.check();
    },

    onQueueComplete: function() {
      this.each(this.results, function(result) {
        var callback = result[0];
        var args = Array.prototype.slice.call(result, 1);
        callback.apply(this, args);
      });
    },

    /**
     * Append callback that runs as soon as all the reasons appeared.
     *
     * First argument is a callback and the rest are passed to the callback as
     * arguments.
     */
    appendResult: function(callback) {
      this.results.push(arguments);
    },

    /**
     * Prepend callback.
     *
     * @see Contextly.CallbackQueue.appendResult()
     */
    prependResult: function(callback) {
      this.results.unshift(arguments);
    },

    check: function() {
      if (this.left === 0) {
        this.onQueueComplete();
      }
    }

  });

})();
