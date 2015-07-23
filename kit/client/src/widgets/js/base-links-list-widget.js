(function($) {

  /**
   * Base class for all widgets displaying links list.
   *
   * @class
   * @extends Contextly.Proxy
   */
  Contextly.widget.BaseLinksList = Contextly.createClass( /** @lends Contextly.widget.BaseLinksList.prototype */ {

    extend: Contextly.widget.Base,

    construct: function(widget) {
      this.widget = widget;
      this.widget_elements = null;
      this.module_view_interval = null;
      this.first_link_elements = [];
      this.document_hidden_property = null;
      this.document_visibility_event = null;
    },

    getScreenWidth: function () {
      return $(window).width();
    },

    hasWidgetData: function () {
        if ( this.widget && this.widget.links ) {
            var links = this.widget.links;
            for(var prop in links) {
                if (links.hasOwnProperty(prop)) {
                    return true;
                }
            }
        }
        return false;
    },

    isDisplaySection: function(section) {
      var display_section = $.inArray(section, this.widget.settings.display_sections) != -1;
      var have_to_display = this.widget.links && this.widget.links[ section ] && this.widget.links[ section ].length > 0;

      return display_section && have_to_display;
    },

    display: function() {
      var widgetHasData = this.hasWidgetData();

      if (widgetHasData) {
        var widget_html = this.getWidgetHTML();
        this.displayHTML( widget_html );
      }
      else {
        // Hide content of the snippet placeholders (e.g. Loading...)
        this.getWidgetContainers().empty();
      }

      this.attachHandlers(widgetHasData);
      this.broadcastWidgetDisplayed();
    },

    getHandlers: function(widgetHasData) {
      var handlers = Contextly.widget.Base.prototype.getHandlers.apply(this, arguments);

      if (widgetHasData) {
        handlers.attachLinksPopups = true;
        handlers.attachBrandingHandlers = true;
        handlers.queueTweetsRendering = true;
        handlers.setUpResponsiveLayout = true;
      }

      return handlers;
    },

    // TODO Refactor.
    attachLinksPopups: function() {
      function onVideoLinkClick(target, e) {
        e.preventDefault();
        target = $(target);
        var videoUrl = getVideoUrl(target);
        var videoTitle = getVideoTitle(target);
        openVideoPopup(videoUrl, videoTitle);

        var contextly_url = getContextlyUrl(target);
        Contextly.MainServerAjaxClient.call(contextly_url);
      }

      $("a[rel='ctx-video-dataurl']").click(this.proxy(onVideoLinkClick, true, true));

      function getVideoClass() {
        return "ctx-video-modal";
      }

      function videoOverlay() {
        return "ctx-video-overlay";
      }

      function getCloseClass() {
        return "ctx-video-close";
      }

      function getVideoUrl(getEvent) {
        return getEvent.attr('href');
      }

      function getContextlyUrl(getEvent) {
        return getEvent.attr('contextly-url');
      }

      function getVideoTitle(getEvent) {
        return getEvent.attr('title');
      }

      function openVideoPopup(ctxVideoUrl, videoTitle) {
        $('body').append(createVideoTmp(ctxVideoUrl, videoTitle));
        showVideoPopup();
      }

      function showVideoPopup() {
        modalFadeIn(getVideoClass());
        modalFadeIn(videoOverlay());
        modalClose();
      }

      function modalFadeIn(elClass) {
        $("." + elClass).fadeIn("fast");
      }

      function modalClose() {
        closeVideoEvent();
        closeModalEsc();
        closeModalBg();
      }

      function createVideoTmp(ctxVideoUrl, videoTitle) {
        var videoLink = formattedYoutubeLink(ctxVideoUrl);
        var videoId = linkFormatter('v', ctxVideoUrl);
        var videoClass = getVideoClass();
        var videotmp = '<div class="' + videoClass + '">' +
          '<iframe src="' + videoLink + '" frameborder="no" class="ctx-video-frame"></iframe>' +
          '<div class="ctx-video-loading" ></div>' +
          '<p class="ctx-video-title">' + videoTitle + '</p>' +
          '<a  href="#" class="ctx-video-close">&#215;</a>' +
          '<div class="ctx-modal-social">' + facebookLike(ctxVideoUrl) + twitterIframe(videoId, videoTitle) + '</div>' +
          '</div>' +
          '<div class="' + videoOverlay() + '"></div>';
        return videotmp;
      }

      function facebookLike(ctxVideoUrl) {
        var script = '<iframe src="//www.facebook.com/plugins/like.php?href=' + ctxVideoUrl +
          '&amp;width=100&amp;layout=button&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=20" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:20px;" allowTransparency="true"></iframe>';
        return script;
      }

      function twitterIframe(videoId, videoTitle) {
        var script = "<iframe allowtransparency='true' frameborder='0' scrolling='no' src='//platform.twitter.com/widgets/tweet_button.html?text=" + videoTitle + "&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" + videoId + "' style='width:98px; height:20px;'></iframe>";
        return script;
      }

      function formattedYoutubeLink(videoUrl) {
        var videoId = linkFormatter('v', videoUrl);
        var fullLink = '//www.youtube.com/embed/' + videoId + "?rel=1&autoplay=1";
        return fullLink;
      }

      function linkFormatter(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return ( results == null ) ? "" : results[1];
      }

      function closeVideoModal() {
        modalFadeOut(getVideoClass());
        modalFadeOut(videoOverlay());
      }

      function modalFadeOut(elClass) {
        var removeEle = function() {
          $(this).remove();
        };
        $("." + elClass).fadeOut("fast", removeEle);
      }

      function closeVideoEvent() {
        $("." + getCloseClass()).click(function(e) {
          e.preventDefault();
          closeVideoModal();
        });
      }

      function closeModalEsc() {
        $('body').keyup(function(e) {
          if (e.which === 27) {
            closeVideoModal();
          }
        });
      }

      function closeModalBg() {
        $("." + videoOverlay()).click(function(e) {
          closeVideoModal();
        });
      }
    },

    queueTweetsRendering: function() {
      twttr.ready(this.proxy(this.renderTweets));
    },

    renderTweets: function() {
      var tweetLinks = this.getWidgetContainers()
        .find('.ctx-link[data-tweet-id]');
      if (!tweetLinks.length) {
        return;
      }

      // Bind tweet click events using jQuery as soon as the tweet rendering is
      // complete, because twitter doesn't provide events here.
      this.bindTwitterEvent('rendered', this.bindTweetClicks);

      // The rest events are provided by Twitter.
      var types = ['click', 'tweet', 'follow', 'retweet', 'favorite'];
      this.each(types, function(eventName) {
        this.bindTwitterEvent(eventName, this.logTwitterEvent);
      });

      this.eachElement(tweetLinks, this.renderTweet);
    },

    renderTweet: function(element) {
      // Cleanup the element content and mark section with special class.
      var a = element.find('a[rel="ctx-tweet-dataurl"]:first');
      var nativeUrl = a.attr('href');
      var contextlyUrl = a.attr('contextly-url');
      element
        .attr('data-native-url', nativeUrl)
        .attr('data-contextly-url', contextlyUrl)
        .empty()
        .addClass('ctx-tweet');
      element
        .parents('.ctx-section:first')
        .not('.ctx-social-section')
        .addClass('ctx-social-section');

      var id = element.attr('data-tweet-id');
      twttr.widgets.createTweet(id, element[0], {
        cards: 'hidden',
        conversation: 'none'
      });
    },

    bindTwitterEvent: function(type, callback) {
      twttr.events.bind(type, this.proxy(function(e) {
        var link = $(e.target).parents('.ctx-link.ctx-tweet:first');
        if (!link.length) {
          return;
        }

        callback.call(this, e, link);
      }, false, true));
    },

    bindTweetClicks: function(e) {
      $(e.target)
        .contents()
        .find('blockquote.tweet')
        .bind('click', this.proxy(this.onTweetClick, true, true));
    },

    onTweetClick: function(blockquote, e) {
      var targetSelector = 'a[data-scribe^="element:"]';
      var target = $(e.target);
      if (!target.is(targetSelector)) {
        target = target.parents(targetSelector + ':first');
        if (!target.length) {
          return;
        }
      }

      var tweetId = $(blockquote).attr('data-tweet-id');
      if (!tweetId) {
        return;
      }

      var attrValue = Contextly.Utils.escapeSizzleAttrValue(tweetId);
      var link = this.getWidgetContainers()
        .find('.ctx-link.ctx-tweet[data-tweet-id="' + attrValue + '"]:first');
      if (!link.length) {
        return;
      }

      var scribeType = target.attr('data-scribe')
        .replace(/^element:/, '');
      if ($.inArray(scribeType, ['reply', 'retweet', 'favorite']) !== -1) {
        // These types are handled through native Twitter events.
        return;
      }

      var href = target.attr('href');
      if (scribeType === 'url') {
        var expandedUrl = target.attr('data-expanded-url');

        if (expandedUrl) {
          // Use expanded rather than shortened URL on the events log.
          href = expandedUrl;

          // On the target URL we should send a request to the main server and
          // exit.
          var nativeUrl = link.attr('data-native-url');
          if (expandedUrl.toLowerCase() === nativeUrl.toLowerCase()) {
            var contextlyUrl = link.attr('data-contextly-url');
            Contextly.MainServerAjaxClient.call(contextlyUrl);
            return;
          }
        }
      }

      Contextly.EventsLogger.tweetEvent('link', {
        event_element: scribeType,
        event_tweet_id: tweetId,
        event_url: href
      });
    },

    logTwitterEvent: function(e, link) {
      var tweetId = link.attr('data-tweet-id');
      if (!tweetId) {
        return;
      }

      Contextly.EventsLogger.tweetEvent(e.type, {
        event_element: e.region,
        event_tweet_id: tweetId
      });
    },

    getImageDimension: function() {
      return this.getImageDimensionFor(this.getSettings().images_type);
    },

    getImageDimensionFor: function(image_type) {
      image_type = image_type.replace('square', '').replace('letter', '');

      var dimensions = image_type.split('x');
      var w = 0;
      var h = 0;

      if (dimensions.length == 2) {
        w = parseInt(dimensions[0]);
        h = parseInt(dimensions[1]);
      }

      return {width: w, height: h};
    },

    getImagesHeight: function() {
      var image_dimension = this.getImageDimension();
      return image_dimension.height;
    },

    getImagesWidth: function() {
      var image_dimension = this.getImageDimension();
      return image_dimension.width;
    },

    getWidgetLinks: function() {
      if (this.getWidget() && this.getWidget().links) {
        return this.getWidget().links;
      }

      return null;
    },

    getModuleType: function() {
      return this.getSettings().display_type;
    },

    getWidgetSectionLinks: function(section) {
      var widget_links = this.getWidgetLinks();

      if (widget_links && widget_links[ section ]) {
        return widget_links[ section ];
      }

      return null;
    },

    getLinkThumbnailUrl: function(link) {
      if (link.thumbnail_url) {
        return link.thumbnail_url;
      }

      return null;
    },

    getWidgetStyleClass: function() {
      return 'default-widget';
    },

    getLinkIcon: function(link) {
      if (link.video) {
        return '<span class="ctx-icon ctx-icon-video"></span>';
      } else if (link.tweet) {
        return '<span class="ctx-icon ctx-icon-twitter"></span>';
      }
      return '';
    },

    // TODO Check if any use cases left after moving to templates and drop.
    escape: function(text) {
      return Contextly.Utils.escape(text);
    },

    getEventTrackingHtml: function(link) {
      var settings = this.getSettings();
      var html = " onmousedown=\"";

      if (!link.video) {
          html += "this.href='" + this.escape(link.url) + "';"
      }

      if (settings && settings.utm_enable) {
        html += this.getTrackLinkJSHtml(link);
      }

      html += "\"";

      return html;
    },

    getLinkATag: function(link, content) {
      return "<a href=\"" +
        this.escape(link.native_url) + "\" title=\"" +
        this.escape(link.title) + "\" class='ctx-clearfix ctx-nodefs' " +
        this.getEventTrackingHtml(link) + ">" +
        content + "</a>";
    },

    getVideoLinkATag: function(link, content) {
      return "<a rel=\"ctx-video-dataurl\" class='ctx-clearfix ctx-nodefs' href=\"" +
        this.escape(link.native_url) + "\" title=\"" +
        this.escape(link.title) + "\" contextly-url=\"" + link.url + "\" " +
        this.getEventTrackingHtml(link) + ">" + content + "</a>";
    },

    getTweetLinkATag: function(link, content) {
      return "<a rel=\"ctx-tweet-dataurl\" class='ctx-clearfix ctx-nodefs' href=\"" +
        this.escape(link.native_url) + "\" title=\"" +
        this.escape(link.title) + "\" contextly-url=\"" + link.url + "\" " +
        this.getEventTrackingHtml(link) + ">" + content + "</a>";
    },

    getTrackLinkJSHtml: function(link) {
      var widget_type = this.escape(this.getWidgetType());
      var link_type = this.escape(link.type);
      var link_url = this.escape(link.url);
      var link_title = this.escape(link.title);

      return this.escape("Contextly.PageEvents.trackLink('" + widget_type + "','" + link_type + "','" + link_url + "','" + link_title + "');");
    },

    getLinkHTML: function(link) {
      if (link.video) {
        return this.getLinkHTMLVideo(link);
      } else if (link.tweet) {
        return this.getLinkHTMLTweet(link);
      } else {
        return this.getLinkHTMLNormal(link);
      }
    },

    getInnerLinkHTML: function(link) {
      return link.title;
    },

    getLinkHTMLVideo: function(link) {
      return "<div class='ctx-link'>" + this.getVideoLinkATag(link, this.getInnerLinkHTML(link)) + "</div>";
    },

    getLinkHTMLTweet: function(link) {
      return "<div class='ctx-link'>" + this.getTweetLinkATag(link, this.getInnerLinkHTML(link)) + "</div>";
    },

    getLinkHTMLNormal: function(link) {
      return "<div class='ctx-link'><div class='ctx-link-title'>" + this.getLinkATag(link, this.getInnerLinkHTML(link)) + "</div></div>";
    },

    isDisplayContextlyLogo: function() {
      return Contextly.Settings.isBrandingDisplayed();
    },

    getBrandingButtonHtml: function () {
      if (!this.isDisplayContextlyLogo()) {
        return '';
      }

      var div = "<div class='ctx-branding ctx-clearfix'>";
      div += "<a href='https://contextly.com' class='ctx-branding-link ctx-nodefs'>Powered by</a>";
      div += "</div>";
      return div;
    },

    attachBrandingHandlers: function() {
      if (!this.isDisplayContextlyLogo()) {
        return;
      }

      this.getWidgetContainers()
        .find(".ctx-branding-link")
        .click(function(event) {
          event.preventDefault();
          Contextly.overlay.Branding.open();
        });
    },

    getWidgetElements: function() {
      if (this.widget_elements === null) {
        this.widget_elements = this.getWidgetContainers()
          .find('.' + this.getWidgetStyleClass());
      }

      return this.widget_elements;
    },

    getLayoutModes: function() {
      return {};
    },

    setUpResponsiveLayout: function() {
      if (Contextly.Utils.isEmptyObject(this.getLayoutModes())) {
        return;
      }

      this.checkLayoutThresholds();

      var checkCount = 0;
      var interval = setInterval(this.proxy(function() {
        checkCount++;
        if (checkCount > 5) {
          clearInterval(interval);
        }

        this.checkLayoutThresholds();
      }), 500);

      $(window)
        .resize(this.proxy(this.checkLayoutThresholds))
        .load(this.proxy(function() {
          clearInterval(interval);
          this.checkLayoutThresholds();
        }));
    },

    sizeMatchesThresholds: function(size, thresholds) {
      return (size >= thresholds[0] && (!thresholds[1] || size < thresholds[1]));
    },

    checkLayoutThresholds: function() {
      var modes = this.getLayoutModes();
      var elements = this.getWidgetElements();
      this.eachElement(elements, function(element) {
        this.each(modes, function(thresholds, name) {
          if (this.sizeMatchesThresholds(element.width(), thresholds)) {
            this.setLayoutMode(element, name);
            return false;
          }
        });
      });
    },

    buildLayoutClass: function(mode) {
      return 'ctx-' + mode;
    },

    setLayoutMode: function(element, mode) {
      var key = 'ctxLayoutMode';
      var lastMode = element.data(key);

      if (mode === lastMode) {
        // Nothing to do.
        return;
      }

      // Be silent on the first time.
      var firstTime = (lastMode == null);

      if (!firstTime) {
        element.removeClass(this.buildLayoutClass(lastMode));
      }

      element.data(key, mode);
      element.addClass(this.buildLayoutClass(mode));

      if (!firstTime) {
        this.broadcast(Contextly.widget.broadcastTypes.LAYOUT_CHANGED, mode);
      }
    },

    attachWidgetViewHandler: function() {
      // TODO Replace polling with browser events monitoring.
      this.resumeWidgetViewPolling();

      // Use page visibility API to poll on active page only.
      var hidden, event;
      if ((hidden = 'hidden') in document) {
        event = "visibilitychange";
      }
      else if ((hidden = "mozHidden") in document) {
        event = "mozvisibilitychange";
      }
      else if ((hidden = "webkitHidden") in document) {
        event = "webkitvisibilitychange";
      }
      else {
        return;
      }

      event = this.nsEvent(event);
      this.document_hidden_property = hidden;
      this.document_visibility_event = event;
      $(document).bind(event, this.proxy(this.onPageVisibilityChange));
    },

    detachWidgetViewHandler: function() {
      this.pauseWidgetViewPolling();

      if (this.document_visibility_event != null) {
        $(document).unbind(this.document_visibility_event);
      }
    },

    onPageVisibilityChange: function() {
      var hidden = this.document_hidden_property;
      if (hidden == null) {
        return;
      }

      if (document[hidden]) {
        this.pauseWidgetViewPolling();
      }
      else {
        this.resumeWidgetViewPolling();
      }
    },

    pauseWidgetViewPolling: function() {
      if (this.module_view_interval != null) {
        clearInterval(this.module_view_interval);
        this.module_view_interval = null;
      }
    },

    resumeWidgetViewPolling: function() {
      this.module_view_interval = window.setInterval(this.proxy(this.checkWidgetVisibility), 300);
    },

    getFirstLinkElement: function(index, widgetElement) {
      if (this.first_link_elements[index] == null) {
        this.first_link_elements[index] = widgetElement.find('.ctx-section .ctx-link:first');
      }

      return this.first_link_elements[index];
    },

    getViewport: function() {
      var win = $(window);

      var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
      };
      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();
      return viewport;
    },

    isElementInsideViewport: function(el, viewport) {
      var bounds = el.offset();
      bounds.right = bounds.left + el.outerWidth();
      bounds.bottom = bounds.top + el.outerHeight();

      var isOutsideViewport = (
        viewport.right < bounds.left
          || viewport.left > bounds.right
          || viewport.bottom < bounds.top
          || viewport.top > bounds.bottom
        );

      return !isOutsideViewport;
    },

    checkWidgetVisibility: function() {
      var viewport = this.getViewport();
      var elements = this.getWidgetElements();
      this.eachElement(elements, function(element, index) {
        var firstLink = this.getFirstLinkElement(index, element);
        if (this.isElementInsideViewport(firstLink, viewport)) {
          var guid = Contextly.Visitor.getGuid();
          if (guid != null) {
            Contextly.EventsLogger.logEvent(Contextly.widget.eventNames.MODULE_VIEW, {
              event_guid: guid
            });
          }

          this.detachWidgetViewHandler();
          this.broadcast(Contextly.widget.broadcastTypes.IN_VIEWPORT);

          // No reasons to continue the loop.
          return false;
        }
      });
    }

  });

})(jQuery);
