(function($) {

  Contextly.PageView = Contextly.createClass({

    extend: Contextly.Proxy.prototype,

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

        this.attachLogEvents();

        var callback = this.proxy(this.onWidgetsLoadingComplete, false, true);
        Contextly.RESTClient.call('pagewidgets', 'get', {}, callback);
      },

      onWidgetsLoadingComplete: function(response) {
        this.widgetsLoading = false;
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

        // TODO: Drop on API update.
        if (response.entry.snippets
          && response.entry.snippets[0]
          && response.entry.snippets[0].settings
          && response.entry.snippets[0].settings.storyline_subscribe
          && !response.entry.storyline_subscribe) {
          response.entry.storyline_subscribe = [
            {
              type: Contextly.widget.types.STORYLINE_SUBSCRIBE,
              settings: {
                subscribe_newsletter: response.entry.snippets[0].settings.subscribe_newsletter || false
              }
            }
          ];
        }

        Contextly.Visitor.initIds(response);
        this.updatePostAction(response);
        this.displayWidgets(response);

        this.broadcast(Contextly.PageView.broadcastTypes.DISPLAYED, response);
      },

      onWidgetsLoadingError: function(response) {
        this.broadcast(Contextly.PageView.broadcastTypes.FAILED, response);
      },

      broadcast: function(type) {
        var args = Array.prototype.slice.call(arguments, 1);
        $(window).triggerHandler(type, args);
      },

      getDisplayableWidgetCollections: function(response) {
        return [
          response.entry.snippets,
          response.entry.sidebars,
          response.entry.auto_sidebars,
          response.entry.storyline_subscribe
        ];
      },

      displayWidgets: function(response) {
        var collections = this.getDisplayableWidgetCollections(response);

        for (var i = 0; i < collections.length; i++) {
          if (!collections[i]) {
            continue;
          }

          var widgets = collections[i];
          for ( var j = 0; j < widgets.length; j++ ) {
            var widgetObject = Contextly.widget.Factory.getWidget( widgets[ j ] );
            if ( !widgetObject ) {
              continue;
            }

            widgetObject.display();
          }
        }
      },

      updatePostAction: function(response) {
        if (!response.entry.update) {
          return;
        }

        Contextly.RESTClient.call('postsimport', 'put');
      },

      attachLogEvents: function() {
        Contextly.LogPluginEvents.attachEvent('contextlyDataFailed');
        Contextly.LogPluginEvents.attachEvent('contextlySettingsAuthSuccess');
        Contextly.LogPluginEvents.attachEvent('contextlySettingsAuthFailed');
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

})(jQuery);
