

/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.SiderailCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.SiderailCssCustomBuilder */ {

    buildCSS: function(entry, settings) {
      var result = '';
      var css = settings.css || {};

      if (css.custom_code) {
        result += Contextly.Utils.escape(css.custom_code);
      }

      var selector = '.ctx-sr-title p';
      if (css.title_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.title_font_family);
      }
      if (css.title_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.title_font_size);
      }
      if (css.title_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.title_color);
      }

      selector = '.ctx-link';
      if (css.links_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.links_font_size);
      }

      selector = '.ctx-link-title p';
      if (css.links_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.links_font_family);
      }
      if (css.links_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.links_color);
      }

      selector = '';
      if (css.border_color) {
        result += this.buildCSSRule(entry, selector, 'border-color', css.border_color);
      }
      if (css.background_color) {
        result += this.buildCSSRule(entry, selector, 'background-color', css.background_color);
      }

      return result;
    }

  }

});
