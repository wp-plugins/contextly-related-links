/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.TextCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.TextCssCustomBuilder */ {

    buildCSS: function(entry, settings) {
      var result = "";
      var css = settings.css || {};

      if (css.custom_code) {
        result += Contextly.Utils.escape(css.custom_code);
      }

      var selector = '.ctx-content-text .ctx-links-header p';
      if (css.title_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.title_font_family);
      }
      if (css.title_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.title_font_size);
      }
      if (css.title_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.title_color);
      }

      selector = [
        '.ctx-content-text .ctx-link',
        '.ctx-content-text .ctx-link a'
      ];
      if (css.links_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.links_font_family);
      }
      if (css.links_font_size) {
        // Apply to the outer element only, because otherwise X% values wouldn't
        // work properly.
        result += this.buildCSSRule(entry, selector[0], 'font-size', css.links_font_size);
      }
      if (css.links_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.links_color);
      }

      selector = [
        '.ctx-content-text .ctx-sections-container',
        '.ctx-content-text .ctx-section'
      ];
      if (css.border_color) {
        result += this.buildCSSRule(entry, selector, 'border-color', css.border_color);
      }

      return result;
    }

  }

});
