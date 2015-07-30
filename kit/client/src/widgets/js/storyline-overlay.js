(function($) {

  /**
   * @class
   * @extends Contextly.overlay.Base
   */
  Contextly.overlay.StoryLineSubscribe = Contextly.createClass({

    extend: Contextly.overlay.Base,

    statics: /** @lends Contextly.overlay.StoryLineSubscribe */ {

      open: function(options) {
        Contextly.overlay.Base.open.call(this, null, options);
      },

      renderOverlay: function() {
        var init = Contextly.overlay.Base.renderOverlay.apply(this, arguments);
        if (init) {
          this.overlay.addClass('ctx-storyline-overlay');
        }
      },

      isEmailConfirmed: function() {
        return this.options.email_confirmed;
      },

      isNewsletterInputEnabled: function() {
        return !this.isEmailConfirmed() && this.options.subscribe_newsletter;
      },

      renderDialog: function() {
        var isConfirmed = this.isEmailConfirmed();
        var isNewsletterEnabled = this.isNewsletterInputEnabled();

        if (!this.dialog) {
          var inputs = '';
          if (!isConfirmed) {
            inputs = '<div class="ctx-email-row ctx-input-row">'
              + '<input type="email" class="ctx-email" placeholder="Email address" />'
              + '</div>';

            if (isNewsletterEnabled) {
              inputs += '<div class="ctx-newsletter-row ctx-input-row">'
                + '<input class="ctx-newsletter" type="checkbox" id="ctx-storyline-subscribe-newsletter" checked="checked">'
                + ' '
                + '<label class="ctx-newsletter-label" for="ctx-storyline-subscribe-newsletter">'
                + Contextly.Utils.escape( this.options.subscribe_newsletter_title )
                + '</label>'
                + '</div>';
            }
          }

          var content = '<div id="ctx-storyline-popup" class="ctx-overlay-dialog">'
            + '<div class="ctx-header">'
            + '<span class="ctx-header-title">'
            + 'Follow this Storyline'
            + '</span>'
            + '</div>'
            + '<div class="ctx-body">'
            + '<div class="ctx-message-row"></div>'
            + inputs
            + '<div class="ctx-follow-row ctx-input-row">'
            + '<button class="ctx-follow"><span class="ctx-follow-label">Follow</span></button>'
            + '</div>'
            + '<div class="ctx-terms-row">'
            + "Don't worry. We <b>don't</b> spam, and <b>never</b> sell or rent addresses."
            + '</div>'
            + '</div>'
            + '<div class="ctx-footer ctx-clearfix">'
            + '<a class="ctx-how-link" target="_blank" href="http://contextly.com/follow-up-explained">How does this work?</a>'
            + '<a class="ctx-logo-link" target="_blank" href="http://contextly.com">Powered by</a>'
            + '</div>'
            + '</div>';
          this.dialog = $(content)
            .appendTo('body');
        }
        else {
          // Show dialog and reset its state after previous attempts.
          this.dialog.show();
          this.getMessage()
            .hide();
          this.getInputRows()
            .show();
          this.getEmailInput()
            .val('');
          if (isNewsletterEnabled) {
            // Avoid using jQuery.attr() as it works different in jQuery >=1.6
            // and <1.6. DOM property is more portable here.
            this.getNewsletterCheckbox()[0].checked = true;
          }
        }
      },

      bindHandlers: function() {
        Contextly.overlay.Base.bindHandlers.apply(this, arguments);

        this.getSubmit()
          .bind(this.ns('click'), this.proxy(this.onSubmit, false, true));
        this.getEmailInput()
          .bind(this.ns('keypress'), this.proxy(this.onEmailInputKeyPress, false, true))
      },

      unbindHandlers: function() {
        Contextly.overlay.Base.unbindHandlers.apply(this, arguments);

        this.getSubmit()
          .unbind(this.ns('click'));
        this.getEmailInput()
          .unbind(this.ns('keypress'));
      },

      destroyDialog: function() {
        this.dialog.hide();
      },

      onEmailInputKeyPress: function(e) {
        if (e.which == 13) {
          this.onSubmit(e);
        }
      },

      onOpeningComplete: function() {
        Contextly.overlay.Base.onOpeningComplete.apply(this, arguments);

        if (!this.animating) {
          if (this.isEmailConfirmed()) {
            this.subscribeToStoryLine();
          }
          else {
            this.registerButtonClick();
          }
        }
      },

      onSubmit: function(e) {
        e.preventDefault();

        var params = {};
        if (!this.isEmailConfirmed()) {
          var email = $.trim(this.getEmailInput().val());
          if (!email || !Contextly.Utils.isEmailValid(email)) {
            this.errorMessage('Please enter valid email address.');
            return;
          }

          params.email = email;
          if (this.isNewsletterInputEnabled()) {
            params.subscribe_newsletter = this.getNewsletterCheckbox().is(':checked') ? 1 : 0;
          }
        }

        this.subscribeToStoryLine(params);
      },

      registerButtonClick: function() {
        Contextly.RESTClient.call('storylines', 'button-click');
      },

      subscribeToStoryLine: function(params) {
        this.lockSubmit();
        this.hideMessage();

        params = params || {};
        var callback = this.proxy(this.onSubscribeComplete, false, true);
        if (this.isEmailConfirmed()) {
          Contextly.RESTClient.call('storylines', 'button-click', params, callback);
        }
        else {
          Contextly.RESTClient.call('storylines', 'subscribe', params, callback);
        }
      },

      onSubscribeComplete: function(response) {
        this.unlockSubmit();

        if (response && response.success) {
          if (response.confirmed) {
            this.successMessage('We added this story to your FollowUp list.');
          }
          else {
            this.successMessage('Almost done! Check your email.');
          }
        }
        else {
          var message = 'Something went wrong.';
          if (response && response.error) {
            message = response.error;
          }
          this.errorMessage(message);
        }
      },

      lockSubmit: function() {
        this.getSubmit()
          .attr('disabled', 'disabled')
          .addClass('ctx-progress');
      },

      unlockSubmit: function() {
        this.getSubmit()
          .removeAttr('disabled')
          .removeClass('ctx-progress');
      },

      getMessage: function() {
        return this.dialog.find('.ctx-message-row');
      },

      getEmailInput: function() {
        return this.dialog.find('.ctx-email');
      },

      getNewsletterCheckbox: function() {
        return this.dialog.find('.ctx-newsletter');
      },

      getSubmit: function() {
        return this.dialog.find('.ctx-follow');
      },

      getInputRows: function() {
        return this.dialog.find('.ctx-input-row');
      },

      showMessage: function(text, className) {
        var message = this.getMessage();
        var duration = this.options.duration;

        var fadeIn = this.proxy(function() {
          message.removeClass('ctx-success ctx-error ctx-info')
            .addClass(className)
            .text(text)
            .animate({opacity: 1}, duration);
        });

        if (message.is(':visible')) {
          duration /= 2;
          message
            .stop(true)
            .animate({opacity: 0}, duration, fadeIn);
        }
        else {
          message.css('opacity', 0)
            .show();
          fadeIn();
        }

        this.refreshDialogSizes();
      },

      hideMessage: function() {
        var message = this.getMessage();

        if (message.is(':visible')) {
          message.stop(true)
            .animate({opacity: 0.2}, this.options.duration);
        }
      },

      errorMessage: function(message) {
        this.showMessage(message, 'ctx-error');
      },

      successMessage: function(message) {
        this.getInputRows()
          .hide();
        this.showMessage(message, 'ctx-success');
        setTimeout(this.proxy(this.close), 3000);
      }

    }

  });

})(jQuery);


