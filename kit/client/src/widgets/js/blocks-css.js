/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.BlocksCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.BlocksCssCustomBuilder */ {

    buildCSS: function(entry, settings) {
      var result = '';
      var css = settings.css || {};

      if (css.custom_code) {
        result += Contextly.Utils.escape(css.custom_code);
      }

      var selector = '.ctx-content-block .ctx-links-header p';
      if (css.title_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.title_font_family);
      }
      if (css.title_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.title_font_size);
      }
      if (css.title_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.title_color);
      }

      selector = '.ctx-content-block .ctx-link-title';
      if (css.links_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.links_font_family);
      }
      if (css.links_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.links_font_size);
      }
      if (css.links_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.links_color);
      }

      selector = [
        '.ctx-content-block .ctx-sections-container',
        '.ctx-content-block .ctx-section'
      ];
      if (css.border_color) {
        result += this.buildCSSRule(entry, selector, 'border-color', css.border_color);
      }

      selector = '.ctx-content-block';
      if (css.background_color) {
        result += this.buildCSSRule(entry, selector, 'background-color', css.background_color);
      }

      selector = '.ctx-content-block .ctx-link-title';
      if (css.overlay_color) {
        result += this.buildCSSRule(entry, selector, 'background', css.overlay_color);

        try {
          var color = new Contextly.color.RGB(css.overlay_color);
          var rgba = "rgba(" + color.red + "," + color.green + "," + color.blue + ",0.85)";
          result += this.buildCSSRule(entry, selector, "background", rgba);
        }
        catch (e) {
          Contextly.Utils.logError('Unable to parse the overlay color ' + css.overlay_color);
        }
      }

      return result;
    }

  }

});
