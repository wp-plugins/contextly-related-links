/**
 * @class
 */
Contextly.PageEvents = Contextly.createClass({

  statics: /** @lends Contextly.PageEvents */{

    trackLink: function(widget_type, link_type, link_title) {
      if (!widget_type || !link_type || !link_title) {
        return;
      }

      var label_limit = 30;
      var action = 'ClickedOutBound';
      var label = link_title;

      var category;
      if (widget_type === Contextly.widget.types.SIDEBAR) {
        category = 'ContextlySidebar';
      }
      else {
        category = 'ContextlyModule';
      }

      if (label.length > label_limit) {
        label = label.substr(0, label_limit);
      }

      if (widget_type == Contextly.widget.types.SIDEBAR && ( link_type == Contextly.widget.linkTypes.WEB || link_type == Contextly.widget.linkTypes.PREVIOUS )) {
        action = 'ClickedRecentRelated';
      }
      else if (link_type == Contextly.widget.linkTypes.PREVIOUS) {
        action = 'ClickedPreviousRelated';
      }
      else if (link_type == Contextly.widget.linkTypes.RECENT) {
        action = 'ClickedRecentRelated';
      }
      else if (link_type == Contextly.widget.linkTypes.PROMO) {
        action = 'ClickedPromoLink';
      }
      else {
        action = 'Clicked' + link_type.charAt(0).toUpperCase() + link_type.slice(1);
      }

      if (typeof window.pageTracker != 'undefined') {
        pageTracker._trackEvent(category, action, label);
      }
      else if (typeof window._gaq != 'undefined') {
        _gaq.push(['_trackEvent', category, action, label]);
      }
    }

  }

});
