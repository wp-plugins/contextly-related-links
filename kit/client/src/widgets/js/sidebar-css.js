/**
 * @class
 * @extends Contextly.widget.CssCustomBuilder
 */
Contextly.widget.SidebarCssCustomBuilder = Contextly.createClass({

  extend: Contextly.widget.CssCustomBuilder,

  statics: /** @lends Contextly.widget.SidebarCssCustomBuilder.prototype */ {

    buildCSS: function(entry, settings) {
      var result = '';
      var css = settings.css || {};

      if (css.custom_code) {
        result += Contextly.Utils.escape(css.custom_code);
      }

      var selector = '.ctx-content-sidebar .ctx-sb-title p';
      if (css.title_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.title_font_family);
      }
      if (css.title_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.title_font_size);
      }
      if (css.title_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.title_color);
      }

      selector = '.ctx-content-sidebar .ctx-sb-description p';
      if (css.description_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.description_font_family);
      }
      if (css.description_font_size) {
        result += this.buildCSSRule(entry, selector, 'font-size', css.description_font_size);
      }
      if (css.description_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.description_color);
      }

      selector = [
        '.ctx-content-sidebar .ctx-sb-link',
        '.ctx-content-sidebar .ctx-sb-text p'
      ];
      if (css.links_font_family) {
        result += this.buildCSSRule(entry, selector, 'font-family', css.links_font_family);
      }
      if (css.links_font_size) {
        // Apply to the outer element only, to properly handle X% values.
        result += this.buildCSSRule(entry, selector[0], 'font-size', css.links_font_size);
      }
      selector = '.ctx-content-sidebar .ctx-sb-text a';
      if (css.links_color) {
        result += this.buildCSSRule(entry, selector, 'color', css.links_color);
      }

      selector = [
        '.ctx-content-sidebar',
        '.ctx-content-sidebar .ctx-sb-title',
        '.ctx-content-sidebar .ctx-sb-description',
        '.ctx-content-sidebar .ctx-sb-content'
      ];
      if (css.line_color) {
        result += this.buildCSSRule(entry, selector, 'border-color', css.line_color);
      }

      selector = '.ctx-content-sidebar .ctx-sb-img';
      if (settings.display_thumbnails && settings.images_type) {
        var matches = settings.images_type.match(/^(?:letter|square)(\d+)/i);
        if (matches[1]) {
          result += this.buildCSSRule(entry, selector, 'max-width', matches[1] + 'px');
        }
      }

      selector = '.ctx-content-sidebar';
      if (css.background_color) {
        result += this.buildCSSRule(entry, selector, 'background-color', css.background_color);
      }

      return result;
    }

  }

});
