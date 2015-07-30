(function($) {

  /**
   * Font loader that checks for font existence.
   *
   * For the font detection method see:
   * https://samclarke.com/2013/06/javascript-is-font-available/
   *
   * @class
   */
  Contextly.FontManager = Contextly.createClass({

    extend: [Contextly.Proxy.prototype, Contextly.Transmitter.prototype],

    statics: /** @lends Contextly.FontManager */ {

      construct: function() {
        this.left = 0;
        this.fonts = {};
        this.callbacks = [];
        this.fallbackWidths = {};
      },

      getContainerStyle: function(font) {
        var style = 'position: absolute !important; white-space: nowrap !important; font-size: 128px !important; width: auto !important; top: -9999px !important; left: 0 !important;';

        if (font) {
          style += ' font-family: ' + font + ' !important';
        }
        else {
          style += ' display: none !important';
        }

        return style;
      },

      getContainer: function() {
        if (typeof this.container === 'undefined') {
          this.container = $('<div/>')
            .attr('style', this.getContainerStyle())
            .text((new Array(40)).join('wmkgil'))
            .appendTo('body');
        }

        return this.container;
      },

      getFontWidth: function(font, fallback) {
        if (fallback) {
          font += ',' + fallback;
        }

        var container = this.getContainer()
          .attr('style', this.getContainerStyle(font));
        var width = container.width();
        container.attr('style', this.getContainerStyle());

        return width;
      },

      getFallbackFonts: function() {
        return ['serif', 'sans-serif', 'monospace'];
      },

      fontExists: function(font) {
        var fallbacks = this.getFallbackFonts();
        for (var i = 0; i < fallbacks.length; i++) {
          var fallback = fallbacks[i];

          if (typeof this.fallbackWidths[fallback] === 'undefined') {
            this.fallbackWidths[fallback] = this.getFontWidth(fallback);
          }

          if (this.getFontWidth(font, fallback) !== this.fallbackWidths[fallback]) {
            return true;
          }
        }

        return false;
      },

      onFontFailed: function(font) {
        this.left--;
        this.fonts[font] = this.fontStates.FAILED;
        this.broadcast(this.broadcastTypes.FONT_FAILED, font);
        this.onLoadingComplete();
      },

      onFontLoaded: function(font) {
        this.left--;
        this.fonts[font] = this.fontStates.LOADED;
        this.broadcast(this.broadcastTypes.FONT_LOADED, font);
        this.onLoadingComplete();
      },

      onLoadingComplete: function() {
        if (this.left > 0) {
          return;
        }

        this.each(this.callbacks, function(item) {
          var fonts = item.fonts;
          var callback = item.callback;
          var states = {};
          this.each(fonts, function(font) {
            states[font] = this.fonts[font];
          });

          try {
            callback(states);
          }
          catch (e) {
            Contextly.Utils.logError('FontLoader callback failed.', item, e);
          }
        });

        this.broadcast(this.broadcastTypes.LOADED);
      },

      startLoading: function(s) {
        if (this.left == 0) {
          this.broadcast(this.broadcastTypes.LOADING);
        }

        this.left += s.fonts.length;
        for (var i = 0; i < s.fonts.length; i++) {
          var font = s.fonts[i];
          this.fonts[font] = this.fontStates.LOADING;
          this.broadcast(this.broadcastTypes.FONT_LOADING, font);
        }

        var config = {
          classes: false,
          fontactive: this.proxy(this.onFontLoaded, false, true),
          fontinactive: this.proxy(this.onFontFailed, false, true)
        };
        config[s.provider] = $.extend({}, s.options, {
          families: s.fonts
        });
        WebFont.load(config);
      },

      load: function(specs) {
        var s = $.extend({
          provider: 'google',
          fonts: [],
          callback: null,
          options: {}
        }, specs);

        if (typeof s.callback === 'function') {
          this.callbacks.push({
            fonts: s.fonts,
            callback: s.callback
          });
        }

        var load = [];
        for (var i = 0; i < s.fonts.length; i++) {
          var font = s.fonts[i];

          if (typeof this.fonts[font] !== 'undefined') {
            continue;
          }

          if (this.fontExists(font)) {
            this.fonts[font] = this.fontStates.EXISTS;
            continue;
          }

          load.push(font);
        }

        if (load.length) {
          s.fonts = load;
          this.startLoading(s);
        }
        else {
          this.onLoadingComplete();
        }
      }

    }

  });

  Contextly.FontManager.fontStates = {
    LOADING: 'loading',
    LOADED: 'loaded',
    EXISTS: 'exists',
    FAILED: 'failed'
  };

  Contextly.FontManager.broadcastTypes = {
    LOADING: 'contextlyFontsLoading',
    LOADED: 'contextlyFontsLoaded',
    FONT_LOADING: 'contextlyFontLoading',
    FONT_LOADED: 'contextlyFontLoaded',
    FONT_FAILED: 'contextlyFontFailed'
  };

})(jQuery);

