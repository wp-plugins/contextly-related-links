(function() {

  Contextly.PageView = Contextly.createClass({

    extend: [Contextly.Proxy.prototype, Contextly.Transmitter.prototype],

    statics: /** @lends Contextly.PageView */ {

      construct: function() {
        this.widgetsLoading = false;
        this.lastWidgetsResponse = null;
      },

      loadWidgets: function() {
        if (this.widgetsLoading) {
          return;
        }
        this.widgetsLoading = true;

        var callback = this.proxy(this.onWidgetsLoadingComplete, false, true);
        Contextly.RESTClient.call('pagewidgets', 'get', {}, callback);
      },

      onWidgetsLoadingComplete: function(response) {
        this.lastWidgetsResponse = response;

        if (response && response.success && response.entry) {
          this.onWidgetsLoadingSuccess(response);
        }
        else {
          this.onWidgetsLoadingError(response);
        }
      },

      onWidgetsLoadingSuccess: function(response) {
        this.broadcast(Contextly.PageView.broadcastTypes.LOADED, response);

        Contextly.Visitor.initIds(response);
        this.updatePostAction(response);
        this.loadWidgetAssets(response);
      },

      onWidgetsLoadingError: function(response) {
        this.widgetsLoading = false;
        this.broadcast(Contextly.PageView.broadcastTypes.FAILED, response);
      },

      extractWidgetsData: function(response) {
        var result = [];
        this.each(response.entry, function(collection) {
          if (!Contextly.Utils.isArray(collection) || !collection.length) {
            return;
          }

          this.each(collection, function(data) {
            if (!data || !data.type) {
              return;
            }

            result.push(data);
          });
        });
        return result;
      },

      loadWidgetAssets: function(response) {
        var queue = new Contextly.CallbackQueue();

        var widgets = [];
        var widgetsData = this.extractWidgetsData(response);
        this.each(widgetsData, function(data) {
          var widget = Contextly.widget.Factory.getWidget(data);
          if (!widget) {
            return;
          }

          widget.loadAssets(queue);
          widgets.push(widget);
        });

        queue.appendResult(this.proxy(this.displayWidgets, false, true), widgets);
        queue.check();
      },

      displayWidgets: function(widgets) {
        this.widgetsLoading = false;

        this.each(widgets, function(widget) {
          widget.display();
        });

        this.broadcast(Contextly.PageView.broadcastTypes.DISPLAYED, widgets);
      },

      updatePostAction: function(response) {
        if (!response.entry.update) {
          return;
        }

        Contextly.RESTClient.call('postsimport', 'put');
      }

    }

  });

  // Broadcast event types.
  Contextly.PageView.broadcastTypes = {
    LOADED: 'contextlyWidgetsLoaded',
    FAILED: 'contextlyWidgetsFailed',
    DISPLAYED: 'contextlyWidgetsDisplayed'
  };

  // Primary entry point for integrations.
  Contextly.load = function() {
    Contextly.PageView.loadWidgets();
  };

})();
