/**
 * @class
 */
Contextly.RESTClient = Contextly.createClass({

  statics: /** @lends Contextly.RESTClient */ {

    getApiRPC: function() {
      if (!this.api_rpc) {
        var remote_url = Contextly.Settings.getAPIServerUrl() + '/easy_xdm/cors/index.html';
        this.api_rpc = new easyXDM.Rpc(
          {
            remote: remote_url
          },
          {
            remote: {
              request: {}
            }
          }
        );
      }
      return this.api_rpc;
    },

    getCommonParams: function() {
      var s = Contextly.Settings;

      var params = {
        version: s.getKitVersion(),
        site_path: s.getAppId(),
        admin: s.isAdmin(),
        page_id: s.getPageId(),
        cookie_id: Contextly.Visitor.getId(),
        type: s.getPostType(),
        c_date: s.getPostCreatedDate(),
        m_date: s.getPostModifiedDate(),
        c_count: s.getPostCategoriesCount(),
        t_count: s.getPostTagsCount(),
        url: s.getPageUrl(),
        guid: Contextly.Visitor.getGuid()
      };

      var clientInfo = s.getClientInfo();
      if (clientInfo != null && clientInfo.client != null) {
        params.client = clientInfo.client;
        if (clientInfo.version != null) {
          params.client += ':' + clientInfo.version;
        }
      }

      return params;
    },

    call: function(api_name, api_method, params, callback) {
      var api_url = Contextly.Settings.getAPIServerUrl() + api_name + '/' + api_method + '/';

      params = jQuery.extend(params, this.getCommonParams());

      var self = this;
      this.getApiRPC().request(
        {
          url: api_url,
          method: "POST",
          data: params
        },
        function(response) {
          if (typeof callback !== 'undefined') {
            self.restCallback(response, callback)
          }
        }
      );
    },

    restCallback: function(response, callback) {
      if (!response.data) {
        return;
      }

      try {
        var data = easyXDM.getJSONObject().parse(response.data);
        callback(data);
      }
      catch (e) {
        Contextly.Utils.logError('Unable to parse/handle API response', response, e);
      }
    }

  }

});

Contextly.RESTClient.errors = {
  FORBIDDEN: 403,
  SUSPENDED: 408
};
