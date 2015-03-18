/**
 * @class
 */
Contextly.BaseSettings = Contextly.createClass({

  statics: {

    /**
     * Returns main Contextly server URL.
     *
     * @function
     */
    getMainServerUrl: function () {
        if ( this.getMode() == 'dev' ) {
            return "http" + ( this.isHttps() ? 's' : '' ) + "://dev.contextly.com/";
        } else {
            return "http" + ( this.isHttps() ? 's' : '' ) + "://contextly.com/";
        }
    },

    /**
     * Returns API server URL.
     *
     * @function
     */
    getAPIServerUrl: function () {
        if ( this.getMode() == 'dev' ) {
            return "http" + ( this.isHttps() ? 's' : '' ) + "://devrest.contextly.com/";
        } else {
            return "http" + ( this.isHttps() ? 's' : '' ) + "://rest.contextly.com/";
        }
    },

    /**
     * Returns parsed post data object.
     *
     * @function
     * @return {Contextly.metadataParser.Base}
     */
    getMetadataParser: function () {
      if (typeof this.metadataParser === 'undefined') {
        // Use our own format by default, it's also a fallback if no other
        // sources found.
        this.metadataParser = Contextly.metadataParser.Default;

        if (!this.metadataParser.dataExists()) {
          for (var key in Contextly.metadataParser) {
            if (key === 'Base' || key === 'Default') {
              continue;
            }

            if (Contextly.metadataParser[key].dataExists()) {
              this.metadataParser = Contextly.metadataParser[key];
              break;
            }
          }
        }
      }

      return this.metadataParser;
    },

    /**
     * Returns URL of the snippet CSS.
     */
    getSnippetCssUrl: function(settings) {
      return this.getCdnCssUrl() + "wp_plugin/" + this.getPluginVersion() + "/css-api/widget/" + settings.display_type + "/template-" + settings.tabs_style + ".css";
    },

    /**
     * Returns URL of the sidebar CSS.
     */
    getSidebarCssUrl: function(settings) {
      return this.getCdnCssUrl() + "wp_plugin/" + this.getPluginVersion() + "/css-api/sidebar/template-" + settings.theme + ".css";
    },

    getPostDataForKey: function(key) {
        return this.getMetadataParser()
          .getData(key);
    },

    getPostDataForKeyCount: function(key) {
        return this.getMetadataParser()
          .getCount(key);
    },

    getPluginVersion: function () {
      var version = this.getPostDataForKey('version');
      if (version == null) {
        version = '1.4';
      }
      return version;
    },

    getAppId: function () {
        return this.getPostDataForKey('app_id');
    },

    getPageId: function() {
      return this.getPostDataForKey('post_id');
    },

    getPostModifiedDate: function() {
      return this.getPostDataForKey('mod_date');
    },

    getPostCreatedDate: function() {
      return this.getPostDataForKey('pub_date');
    },

    getAuthorId: function() {
      return this.getPostDataForKey('author_id');
    },

    getPageUrl: function() {
      return this.getPostDataForKey('url');
    },

    getPostType: function() {
      return this.getPostDataForKey('type');
    },

    getPostCategories: function() {
      return this.getPostDataForKey('categories');
    },

    getPostTags: function() {
      return this.getPostDataForKey('tags');
    },

    getPostCategoriesCount: function() {
      return this.getPostDataForKeyCount('categories');
    },

    getPostTagsCount: function() {
      return this.getPostDataForKeyCount('tags');
    },

    // TODO Switch to Kit CDN.
    getCdnCssUrl: function() {
      if (this.isHttps()) {
        return 'https://c714015.ssl.cf2.rackcdn.com/';
      }
      else {
        return 'http://contextlysitescripts.contextly.com/';
      }
    },

    isAdmin: function () {
      return false;
    },

    isBrandingDisplayed: function() {
      return true;
    },

    isHttps: function () {
      return document.location.protocol === 'https:';
    },

    getMode: function () {
      var mode = this.getPostDataForKey('mode');

      if ( mode != null ) {
          return mode;
      }
      return 'live';
    }

  }

});

/**
 * Default settings object, that can be overridden in any CMS.
 */
Contextly.Settings = Contextly.BaseSettings;
