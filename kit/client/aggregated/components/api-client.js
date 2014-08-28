/**
 * @class
 */
Contextly.RESTClient = Contextly.createClass({

  statics: /** @lends Contextly.RESTClient */ {

    getApiRPC: function() {
      if (!this.api_rpc) {
        var remote_url = Contextly.Settings.getAPIServerUrl() + '/easy_xdm/cors/index.html';
        this.api_rpc = new easyXDM.Rpc({
            remote: remote_url
          },
          {
            remote: {
              request: {}
            }
          });
      }
      return this.api_rpc;
    },

    call: function(api_name, api_method, params, callback) {
      var s = Contextly.Settings;
      var api_url = s.getAPIServerUrl() + api_name + '/' + api_method + '/';

      params = jQuery.extend(params, {
        version: s.getPluginVersion(),
        site_path: s.getAppId(),
        admin: s.isAdmin(),
        page_id: s.getPageId(),
        cookie_id: s.getCookieId(),
        type: s.getPostType(),
        c_date: s.getPostCreatedDate(),
        m_date: s.getPostModifiedDate(),
        c_count: s.getPostCategories().length,
        t_count: s.getPostTags().length
      });

      var self = this;
      this.getApiRPC().request(
        {
          url: api_url,
          method: "POST",
          data: params
        },
        function(response) {
          self.restCallback(response, callback)
        }
      );
    },

    restCallback: function(response, callback) {
      if (!response.data) {
        return;
      }

      var data = easyXDM.getJSONObject().parse(response.data);

      this.restDebug(data);
      callback(data);
    },

    restDebug: function(response) {
      if (response.q && console && console.log) {
        if (response.t) {
          console.log('Time: ' + response.t);
        }
        if (response.m) {
          console.log('Memory: ' + response.m);
        }
        for (var i in response.q) {
          console.log(response.q[i]);
        }
      }
    }

  }

});
