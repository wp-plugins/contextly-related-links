/**
 * Base custom CSS builder.
 */
Contextly.widget.CssCustomBuilder = Contextly.createClass({

  statics: /** @lends Contextly.widget.CssCustomBuilder */ {

    buildCSSRule: function(entry, selectors, property, value) {
      if (!value) {
        return "";
      }

      if (!Contextly.Utils.isArray(selectors)) {
        selectors = [selectors];
      }

      var result = '';
      for (var i = 0; i < selectors.length; i++) {
        if (i) {
          result += ', ';
        }
        result += entry + ' ' + selectors[i];
      }
      result += ' {' + property + ": " + Contextly.Utils.escape(value) + "}";
      return result;
    }

  }

});
