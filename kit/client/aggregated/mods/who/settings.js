(function() {

  /**
   * @class
   * @extends Contextly.BaseSettings
   */
  Contextly.WHOSettings = Contextly.createClass({

    extend: Contextly.BaseSettings,

    statics: /** @lends Contextly.WHOSettings */ {

      detectWhoLanguage: function() {
        // WHO adds language as a latest path segment.
        var matches = /\/([a-z]{2})(?:\/[^\/]*)?$/i.exec(document.location.pathname);
        if (!matches || matches.length < 2) {
          return 'en';
        }

        return matches[1];
      },

      getAppId: function() {
        if (this.whoAppId == null) {
          // App ID for the WHO has the following format: who_[lang]
          var lang = this.detectWhoLanguage();
          this.whoAppId = 'who_' + lang;
        }

        return this.whoAppId;
      }

    }

  });

  Contextly.Settings = Contextly.WHOSettings

})();