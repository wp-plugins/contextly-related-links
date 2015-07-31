(function($) {

  /**
   * @class
   * @extends Contextly.overlay.Dynamic
   */
  Contextly.overlay.Video = Contextly.createClass({

    extend: Contextly.overlay.Dynamic,

    statics: /** @lends Contextly.overlay.Video */ {

      renderOverlay: function() {
        var init = Contextly.overlay.Base.renderOverlay.apply(this, arguments);
        if (init) {
          this.overlay.addClass('ctx-video-overlay');
        }
      },

      getDialogHtml: function() {
        return '<div class="ctx-overlay-dialog ctx-video-modal">'
          + '<div class="ctx-video"></div>'
          + '<div class="ctx-loading"></div>'
          + '<p class="ctx-video-title"></p>'
          + '<a href="#" class="ctx-video-close">&#215;</a>'
          + '<div class="ctx-social"></div>'
          + '</div>';
      },

      getFacebookLikeHtml: function(videoUrl) {
        return '<iframe src="//www.facebook.com/plugins/like.php?href=' + Contextly.Utils.escape(videoUrl) + '&amp;width=100&amp;layout=button&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=20" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:20px;" allowTransparency="true"></iframe>';
      },

      getTweetButtonHtml: function(videoId, videoTitle) {
        var videoIdEncoded = encodeURIComponent(videoId);
        var videoTitleEncoded = encodeURIComponent(videoTitle);

        return "<iframe allowtransparency='true' frameborder='0' scrolling='no' src='//platform.twitter.com/widgets/tweet_button.html?text=" + Contextly.Utils.escape(videoTitleEncoded) + "&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" + Contextly.Utils.escape(videoIdEncoded) + "' style='width:98px; height:20px;'></iframe>";
      },

      renderContent: function(data) {
        var videoId = Contextly.Utils.parseUrlQueryParameter('v', data.videoUrl);
        var videoSrc = '//www.youtube.com/embed/' + videoId + '?rel=1&autoplay=1';

        this.content = this.content || {};

        this.content.title = this.content.title || this.dialog.find('.ctx-video-title');
        this.content.title.text(data.videoTitle);

        var videoHtml = '<iframe src="' + Contextly.Utils.escape(videoSrc) + '" frameborder="no" class="ctx-video-frame"></iframe>';
        this.content.video = $(videoHtml)
          .appendTo(this.dialog.find('.ctx-video'));

        var socialHtml = this.getFacebookLikeHtml(data.videoUrl)
          + this.getTweetButtonHtml(videoId, data.videoTitle);
        this.content.social = $(socialHtml)
          .appendTo(this.dialog.find('.ctx-social'));
      },

      destroyContent: function() {
        this.content.title.empty();

        this.content.video.remove();
        this.content.social.remove();
        delete this.content.video;
        delete this.content.social;
      },

      bindHandlers: function() {
        Contextly.overlay.Dynamic.bindHandlers.apply(this, arguments);

        this.dialog.find(".ctx-video-close")
          .bind(this.ns('click'), this.proxy(this.close));
      },

      unbindHandlers: function() {
        Contextly.overlay.Dynamic.unbindHandlers.apply(this, arguments);

        this.dialog.find(".ctx-video-close")
          .unbind(this.ns('click'));
      }

    }

  });

})(jQuery);