(function() {

  Contextly.assets = Contextly.assets || {};

  Contextly.AssetManager = Contextly.createClass({

    extend: [Contextly.Proxy.prototype, Contextly.Transmitter.prototype],

    statics: {

      construct: function() {
        this.packages = {};
      },

      getConfig: function(name) {
        if (!Contextly.assets[name]) {
          Contextly.Utils.error('Package assets not found: ' + name);
        }

        return Contextly.assets[name];
      },

      remove: function(name) {
        var config = this.getConfig(name);

        // Remove dependencies.
        if (config.include) {
          this.each(config.include, function(dependency) {
            this.remove(dependency);
          });
        }

        // Remove CSS.
        var base = config.base ? (config.base + '/') : '';
        this.each(config.css, function(path) {
          Contextly.CssManager.removeFile(base + path);
        });

        delete this.packages[name];
        this.broadcast(Contextly.AssetManager.broadcastTypes.REMOVED, name);
      },

      render: function(name, queue) {
        if (typeof this.packages[name] !== 'undefined') {
          return;
        }

        var config = this.getConfig(name);
        queue = queue || new Contextly.CallbackQueue();

        this.packages[name] = Contextly.AssetManager.packageStates.LOADING;
        this.broadcast(Contextly.AssetManager.broadcastTypes.LOADING, name);
        queue.prependResult(this.proxy(this.onRenderingComplete, false, true), name);

        // Render dependencies.
        if (config.include) {
          this.each(config.include, function(dependency) {
            this.render(dependency, queue);
          });
        }

        // Render CSS.
        var base = config.base ? (config.base + '/') : '';
        this.each(config.css, function(path) {
          var url = Contextly.Settings.getAssetUrl(base + path, 'css');
          Contextly.CssManager.loadFile(url, base + path, queue.addReason());
        });
      },

      onRenderingComplete: function(name) {
        this.packages[name] = Contextly.AssetManager.packageStates.LOADED;
        this.broadcast(Contextly.AssetManager.broadcastTypes.LOADED, name);
      }

    }

  });

  Contextly.AssetManager.packageStates = {
    LOADING: 'loading',
    LOADED: 'loaded'
  };

  Contextly.AssetManager.broadcastTypes = {
    LOADING: 'contextlyAssetsLoading',
    LOADED: 'contextlyAssetsLoaded',
    REMOVED: 'contextlyAssetsRemoved'
  };

})();