/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.FloatCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.FloatCssCustomBuilder */ {

    buildCSS: function(entry, settings) {
      var result = '';
      var css = settings.css || {};

      if (css.custom_code) {
        result += Contextly.Utils.escape(css.custom_code);
      }

      var selector = '.ctx-content-float .ctx-links-header p';
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
        '.ctx-content-float .ctx-link',
        '.ctx-content-float .ctx-link-title p'
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
        // Apply to the inner only, as it's done by default styles.
        result += this.buildCSSRule(entry, selector[1], 'color', css.links_color);
      }

      selector = [
        '.ctx-content-float .ctx-sections-container',
        '.ctx-content-float .ctx-section'
      ];
      if (css.border_color) {
        result += this.buildCSSRule(entry, selector, 'border-color', css.border_color);
      }

      selector = '.ctx-content-float';
      if (css.background_color) {
        result += this.buildCSSRule(entry, selector, 'background-color', css.background_color);
      }

      return result;
    }

  }

});
