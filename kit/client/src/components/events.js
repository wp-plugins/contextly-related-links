/**
 * Created by andrew on 12/2/14.
 */
(function($) {

  Contextly.EventsLogger = Contextly.createClass({

    statics: /** @lends Contextly.EventsLogger */ {

      logEvent: function(name, params) {
        this.sendEvent(this.eventTypes.LOG, name, params);
      },

      emailEvent: function(name, message, params) {
        params = params || {};
        params.event_page = window.location.href;

        if (message != null) {
          params.event_message = easyXDM.getJSONObject().stringify(message);
        }

        this.sendEvent(this.eventTypes.EMAIL, name, params);
      },

      tweetEvent: function(name, params) {
        this.sendEvent(this.eventTypes.TWEET, name, params);
      },

      sendEvent: function(type, name, params) {
        params = $.extend({
          event_type: type,
          event_name: name
        }, params);

        Contextly.RESTClient.call('events', 'put', params);
      }

    }

  });

  Contextly.EventsLogger.eventTypes = {
    EMAIL: 'email',
    LOG: 'log',
    TWEET: 'tweet'
  };

})(jQuery);
