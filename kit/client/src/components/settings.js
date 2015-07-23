/**
 * @class
 */
Contextly.BaseSettings = Contextly.createClass({

  statics: {

    getServerUrl: function(type) {
      if (!Contextly.data.urls[type]) {
        Contextly.Utils.error(type + ' server URL not found.');
      }

      var urls = Contextly.data.urls[type];
      if (Contextly.Utils.isString(urls)) {
        return urls;
      }
      else {
        var keys = {};
        keys[this.getMode()] = true;
        keys[this.isHttps() ? 'https' : 'http'] = true;
        for (var key in keys) {
          if (typeof urls[key] === 'undefined') {
            continue;
          }

          if (Contextly.Utils.isString(urls[key])) {
            // URL found, add protocol if necessary. We can't use
            // protocol-relative URLs directly because easyXDM can't handle
            // them properly.
            var url = urls[key];

            if (url.indexOf('//') === 0) {
              url = (this.isHttps() ? 'https' : 'http') + ':' + url;
            }

            return url;
          }
          else {
            urls = urls[key];
          }
        }

        // No URL found for the case.
        Contextly.Utils.error(type + ' server URL not found');
      }
    },

    /**
     * Returns main Contextly server URL.
     *
     * @function
     */
    getMainServerUrl: function () {
      return this.getServerUrl('main');
    },

    /**
     * Returns API server URL.
     *
     * @function
     */
    getAPIServerUrl: function () {
      return this.getServerUrl('api');
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
          var formats = this.getSupportedMetadataFormats();
          for (var i = 0; i < formats.length; i++) {
            if (formats[i].dataExists()) {
              this.metadataParser = formats[i];
              break;
            }
          }
        }
      }

      return this.metadataParser;
    },

    /**
     * Returns array of supported metadata formats sorted by reference.
     */
    getSupportedMetadataFormats: function() {
      var result = [];

      for (var key in Contextly.metadataFormats) {
        var parser = Contextly.metadataFormats[key];

        if (typeof parser.getPropertiesMap === 'function') {
          var map = parser.getPropertiesMap();
          if (map.post_id) {
            // Put foreign formats with post ID mapped first.
            result.unshift(parser);
            continue;
          }
        }

        result.push(parser);
      }

      return result;
    },

    getPostDataForKey: function(key) {
        return this.getMetadataParser()
          .getData(key);
    },

    getPostDataForKeyCount: function(key) {
        return this.getMetadataParser()
          .getCount(key);
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

    isAdmin: function () {
      return false;
    },

    isBrandingDisplayed: function() {
      return true;
    },

    isHttps: function () {
      return document.location.protocol === 'https:';
    },

    /**
     * Function returning information about CMS plugin.
     *
     * @returns {Object|null}
     *   Two properties are supported:
     *   - client: short name of the CMS
     *   - version: full version of the CMS plugin having format "Major.Minor"
     *   We don't pass client information in case of empty object or null
     *   returned.
     */
    getClientInfo: function() {
      return null;
    },

    getKitVersion: function() {
      return Contextly.data.versions.kit;
    },

    getCdnVersion: function() {
      return Contextly.data.versions.cdn;
    },

    getAssetUrl: function(path, ext) {
      return this.getServerUrl('cdn') + this.getCdnVersion() + '/' + path + '.' + ext;
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
