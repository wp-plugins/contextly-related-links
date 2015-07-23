(function ($) {

  Contextly.overlay = Contextly.overlay || {};

  Contextly.overlay.Base = Contextly.createClass({

    extend: [Contextly.Proxy.prototype, Contextly.Transmitter.prototype],

    statics: /** @lends Contextly.overlay.Base */ {

      /**
       * Initializes state.
       *
       * We have to use init() instead of static constructor, because our
       * class creation tool doesn't call static constructor of grand-parent
       * class, for now.
       */
      init: function() {
        if (this.initialized) {
          return;
        }
        this.initialized = true;

        // Cache elements wrapped with jQuery.
        var map = {
          window: window,
          document: document,
          html: 'html'
        };
        for (var key in map) {
          this[key] = $(map[key]);
        }

        // Track the number of currently animating elements to be able to run
        // callback when all animations complete.
        this.animating = 0;
      },

      ns: function(eventType) {
        return eventType + '.contextlyOverlay';
      },

      open: function(element, options) {
        this.init();

        if (this.animating) {
          return;
        }

        this.setOptions(options);
        this.lockBodyScroll();
        this.renderOverlay();
        this.renderDialog(element);
        this.refreshDialogSizes();
        this.broadcast(Contextly.overlay.broadcastTypes.BEFORE_OPEN);
        this.animateOpening();
      },

      renderOverlay: function() {
        if (!this.overlay) {
          // Init overlay, which is the same on all dialog types.
          this.overlay = $('<div class="ctx-overlay" />')
            .appendTo('body');
          return true;
        }
        else {
          this.overlay.show();
        }
      },

      /**
       * @function
       *
       * Must set this.dialog element.
       */
      renderDialog: Contextly.abstractMethod(),

      getAnimatedElements: function(markAsAnimating) {
        var elements = this.overlay
          .add(this.dialog);
        if (markAsAnimating) {
          this.animating = elements.length;
        }
        return elements;
      },

      animateOpening: function() {
        this.getAnimatedElements(true)
          .css({
            opacity: 0
          })
          .animate({
            opacity: 1
          }, {
            duration: this.options.duration,
            complete: this.proxy(this.onOpeningComplete)
          });
      },

      onAnimationComplete: function() {
        this.animating--;
        if (this.animating < 0) {
          this.animating = 0;
        }

        return !this.animating;
      },

      onOpeningComplete: function() {
        if (!this.onAnimationComplete()) {
          return;
        }

        this.bindHandlers();
        this.broadcast(Contextly.overlay.broadcastTypes.AFTER_OPEN);
      },

      bindHandlers: function() {
        // Set up event handlers.
        this.window.bind(this.ns('resize'), this.proxy(this.onWindowResize));

        if (this.options.closeOnEsc) {
          this.window.bind(this.ns('keyup'), this.proxy(this.onKeyUp, false, true));
        }

        if (this.options.closeOnOverlayClick) {
          this.overlay.bind(this.ns('click'), this.proxy(this.close));
        }
      },

      close: function() {
        if (this.animating) {
          return;
        }

        if ($.isFunction(this.options.onClose) && this.options.onClose() === false) {
          return;
        }

        this.broadcast(Contextly.overlay.broadcastTypes.BEFORE_CLOSE);
        this.unbindHandlers();
        this.animateClosing();
      },

      unbindHandlers: function() {
        // Cleanup event handlers.
        this.window
          .unbind(this.ns('resize'))
          .unbind(this.ns('keypress'));
        this.overlay.unbind(this.ns('click'));
      },

      animateClosing: function() {
        this.getAnimatedElements(true)
          .animate({
            opacity: 0
          }, {
            duration: this.options.duration,
            complete: this.proxy(this.onClosingComplete)
          });
      },

      onClosingComplete: function() {
        if (!this.onAnimationComplete()) {
          return;
        }

        this.destroyDialog();
        this.destroyOverlay();
        this.unlockBodyScroll();
        this.broadcast(Contextly.overlay.broadcastTypes.AFTER_CLOSE);
      },

      /**
       * @function
       */
      destroyDialog: Contextly.abstractMethod(),

      destroyOverlay: function() {
        this.overlay.hide();
      },

      onKeyUp: function(e) {
        if (e.which === 27) {
          this.close();
        }
      },

      onWindowResize: function() {
        this.refreshDialogSizes();
      },

      setOptions: function(options) {
        if (options) {
          // Allow width & height to be scalar.
          var sizes = ['width', 'height'];
          for (var i = 0; i < sizes.length; i++) {
            var size = sizes[i];
            var type = typeof options[size];
            if (type !== 'undefined' && (type === 'number' || type === 'string')) {
              options[size] = {
                value: options[size],
                min: 0,
                max: 0
              };
            }
          }

          if (options.extend) {
            this.options = $.extend(true, this.options, options);
          }
          else {
            this.options = $.extend(true, this.getDefaultOptions(), options);
          }
        }
        else {
          this.options = this.getDefaultOptions();
        }
      },

      getDefaultOptions: function() {
        return {
          spacing: 40,
          duration: 200,
          width: {
            value: 'auto',
            min: 0,
            max: 0
          },
          height: {
            value: 'auto',
            min: 0,
            max: 0
          },
          closeOnEsc: true,
          closeOnOverlayClick: true,
          extend: false,
          onClose: null,
          dataKey: 'contextlyOverlay'
        };
      },

      broadcast: function (type) {
        return Contextly.Transmitter.prototype.broadcast.call(this, type, this);
      },

      setDialogDimension: function(dimension, dialogSize) {
        this.dialog.css(dimension, dialogSize);
      },

      setDialogPosition: function(coordinate, windowSize, dialogSize) {
        var dialogPosition = Math.floor((windowSize - dialogSize) / 2);
        this.dialog.css(coordinate, dialogPosition);
      },

      refreshDialogSize: function(dimension, coordinate, options) {
        var dialogSize,
          windowSize = this.window[dimension]();

        switch (options.value) {
          case 'window':
            // Dialog is sticky to the window size.
            dialogSize = windowSize - this.options.spacing * 2;
            dialogSize = this.applyDialogSizeLimits(dialogSize, options);
            this.setDialogDimension(dimension, dialogSize);
            this.setDialogPosition(coordinate, windowSize, dialogSize);
            break;

          case 'auto':
            // Dialog dimension depends on the content. Content is responsible to
            // have at least width for proper display.
            var map = {
              width: 'outerWidth',
              height: 'outerHeight'
            };
            var dimensionFunc = map[dimension];
            dialogSize = this.dialog[dimensionFunc]();
            this.setDialogPosition(coordinate, windowSize, dialogSize);
            break;

          default:
            if (typeof options.value !== 'number') {
              $.error('Unsupported overlay ' + dimension + ' value: ' + options.value);
            }

            // Dialog size is a fixed value.
            dialogSize = options.value;
            this.setDialogDimension(dimension, dialogSize);
            this.setDialogPosition(coordinate, windowSize, dialogSize);
            break;
        }
      },

      refreshDialogSizes: function() {
        var dimensions = {
          'width': 'left',
          'height': 'top'
        };
        for (var dimension in dimensions) {
          var coordinate = dimensions[dimension];
          var sideOptions = this.options[dimension];
          this.refreshDialogSize(dimension, coordinate, sideOptions);
        }
      },

      applyDialogSizeLimits: function(value, limits) {
        if (limits.min && value < limits.min) {
          value = limits.min;
        }
        else if (limits.max && value > limits.max) {
          value = limits.max;
        }

        return value;
      },

      lockBodyScroll: function() {
        // Store scroll position and current HTML element style.
        var data = {
          scroll: {
            top: this.window.scrollTop(),
            left: this.window.scrollLeft()
          },
          style: this.html.attr('style')
        };

        // The trick here is that the fixed element with dimensions larger than
        // the window doesn't trigger scrollbars.
        var css = {
          position: 'fixed',
          top: -data.scroll.top,
          left: -data.scroll.left,
          width: '100%'
        };

        // To avoid page "jumping" we force empty scrollbars in case they were
        // visible because of the document height.
        if (this.document.height() > this.window.height()) {
          css['overflow-y'] = 'scroll';
        }

        this.html
          .data(this.options.dataKey, data)
          .css(css);
      },

      unlockBodyScroll: function() {
        var data = this.html.data(this.options.dataKey);
        if (data) {
          // Restore "style" attribute back to its state before we locked the
          // document scrolling. This also removes the scroll lock and our styles.
          // Use non-empty string to be sure style is overwritten (IE 8 fix).
          this.html.attr('style', data.style || ' ');

          // Scroll the page back to its original position.
          this.window
            .scrollTop(data.scroll.top)
            .scrollLeft(data.scroll.left);
        }
      }

    }

  });

  // Event types overlay send to window.
  Contextly.overlay.broadcastTypes = {
    BEFORE_OPEN: 'contextlyOverlayBeforeOpen',
    AFTER_OPEN: 'contextlyOverlayAfterOpen',
    BEFORE_CLOSE: 'contextlyOverlayBeforeClose',
    AFTER_CLOSE: 'contextlyOverlayAfterClose'
  };

})(jQuery);
