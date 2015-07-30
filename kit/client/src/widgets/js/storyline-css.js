/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.StorylineSubscribeCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.StorylineSubscribeCssCustomBuilder */ {

    buildCSS: function(entry, settings) {
      var result = "";

      var container = entry.container;
      var widget = entry.widget;

      var isTransparent = (settings.theme == 'transparent');
      var isButton = (settings.theme == 'button');
      var isSplitButton = (settings.theme == 'split-button');

      if (typeof settings.css.alignment !== 'undefined') {
        result += this.buildCSSRule(container, '', 'text-align', settings.css.alignment);
      }

      if (typeof settings.css.font_family !== 'undefined') {
        result += this.buildCSSRule(widget, '', 'font-family', settings.css.font_family);
      }

      if (typeof settings.css.font_size !== 'undefined') {
        result += this.buildCSSRule(widget, '', 'font-size', settings.css.font_size);
      }

      if (typeof settings.css.text_transform !== 'undefined') {
        result += this.buildCSSRule(widget, '', 'text-transform', settings.css.text_transform);
      }

      if (typeof settings.css.text_color !== 'undefined') {
        if (isTransparent || isButton) {
          result += this.buildCSSRule(widget, '', 'color', settings.css.text_color);
        }
        else if (isSplitButton) {
          result += this.buildCSSRule(widget, '.ctx-subscribe-label', 'color', settings.css.text_color);
        }
      }

      if (typeof settings.css.border_radius !== 'undefined') {
        result += this.buildCSSRule(widget, '', 'border-radius', settings.css.border_radius);

        if (isSplitButton) {
          result += this.buildCSSRule(widget, '.ctx-subscribe-logo', 'border-top-left-radius', settings.css.border_radius);
          result += this.buildCSSRule(widget, '.ctx-subscribe-logo', 'border-bottom-left-radius', settings.css.border_radius);
          result += this.buildCSSRule(widget, '.ctx-subscribe-label', 'border-top-right-radius', settings.css.border_radius);
          result += this.buildCSSRule(widget, '.ctx-subscribe-label', 'border-bottom-right-radius', settings.css.border_radius);
        }
      }

      if (typeof settings.css.background_color !== 'undefined') {
        if (isTransparent) {
          result += this.buildCSSRule(widget, '', 'background-color', settings.css.background_color);
        }
        else {
          var colors = this.generateBackgroundColors(settings.css.background_color);

          if (isButton) {
            result += this.buildCSSRule(widget, '', 'background-color', colors.normal);
            result += this.buildCSSRule(widget, '', 'border-color', colors.border);
            result += this.buildCSSRule(widget + ':hover', '', 'background-color', colors.hover);
          }
          else if (isSplitButton) {
            result += this.buildCSSRule(widget, '.ctx-subscribe-label', 'background-color', colors.normal);
            result += this.buildCSSRule(widget, '.ctx-subscribe-label', 'border-color', colors.border);
            result += this.buildCSSRule(widget + ':hover', '.ctx-subscribe-label', 'background-color', colors.hover);
          }
        }
      }

      if (isTransparent && typeof settings.css.shadow_color !== 'undefined') {
        result += this.buildCSSRule(widget + ':hover', '', 'color', settings.css.shadow_color);
        result += this.buildCSSRule(widget + ':hover', '', 'box-shadow', '0 0 3px ' + settings.css.shadow_color);
      }

      if (isSplitButton) {
        if (typeof settings.css.logo_color !== 'undefined') {
          result += this.buildCSSRule(widget, '.ctx-subscribe-logo', 'color', settings.css.logo_color);
        }

        if (typeof settings.css.logo_background_color !== 'undefined') {
          var logoColors = this.generateBackgroundColors(settings.css.logo_background_color);

          result += this.buildCSSRule(widget, '.ctx-subscribe-logo', 'background-color', logoColors.normal);
          result += this.buildCSSRule(widget, '.ctx-subscribe-logo', 'border-color', logoColors.border);
          result += this.buildCSSRule(widget + ':hover', '.ctx-subscribe-logo', 'background-color', logoColors.hover);
        }
      }

      if (settings.css.custom_code) {
        result += Contextly.Utils.escape(settings.css.custom_code);
      }

      return result;
    },

    generateBackgroundColors: function(original) {
      try {
        var hsv = (new Contextly.color.RGB(original))
          .toHSV();
        var hover = hsv
          .brightness({delta: -10})
          .toRGB()
          .toString();
        var border = hsv
          .brightness({
            delta: -20,
            max: 70
          })
          .toRGB()
          .toString();
        return {
          normal: original,
          hover: hover,
          border: border
        };
      }
      catch (e) {
        Contextly.Utils.logError('Unable to get darker color for mouse over effect and border from ', original, e);

        // Return all original colors.
        return {
          normal: original,
          hover: original,
          border: original
        };
      }
    }

  }

});
