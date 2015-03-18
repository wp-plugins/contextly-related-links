/**
 * @class
 */
Contextly.Visitor = Contextly.createClass({

  statics: /** @lends Contextly.Visitor */ {

    construct: function() {
      this.guid = null;
    },

    getCookieName: function() {
      return "contextly";
    },

    initIds: function(response) {
      if (!response) {
        return;
      }

      if (response.cookie_id && !this.getId()) {
        this.setId(response.cookie_id);
      }
      if (response.guid) {
        this.setGuid(response.guid);
      }
    },

    setId: function(cookie_id) {
      Contextly.Cookie.set(this.getCookieName(), {id: cookie_id}, { expires: 365, path: '/' })
    },

    getId: function() {
      var cookie = Contextly.Cookie.get(this.getCookieName());
      if (cookie && cookie.id && cookie.id != 'null') {
        return cookie.id;
      }
      return null;
    },

    setGuid: function(guid) {
      this.guid = guid;
    },

    getGuid: function() {
      return this.guid;
    }

  }

});
