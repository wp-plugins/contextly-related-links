(function( $ ) {

	Contextly = window.Contextly || {};

	Contextly.PostEditor = Contextly.createClass({
		extend: Contextly.Singleton,

		construct: function() {
			this.isLoading = false;
			this.isLoaded = false;
			this.isUpdateQueued = false;
			this.data = null;
			this.error = false;
		},

		buildAjaxConfig: function (method, addon) {
			var settings = Contextly.Settings.getInstance();

			var result = $.extend(true, {
				url     : settings.getAjaxUrl(),
				type    : 'POST',
				dataType: 'json'
			}, addon);

			var params = result.data || {};

			result.data = {
				action: 'contextly_widgets_editor_request',
				nonce: settings.getAjaxNonce(),
				post_id: Contextly.Settings.getInstance().getPageId(),
				method: method,
				params: params
			};

			return result;
		},

		loadData: function () {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;

			$.ajax(this.buildAjaxConfig('get-editor-data', {
				success: this.proxy(this.onDataLoadingSuccess),
				error  : this.proxy(this.onDataLoadingFailure)
			}));

			this.fireEvent('contextlyDataLoading');
		},

		onDataLoadingSuccess: function(data) {
			this.isLoading = false;
			this.isLoaded = true;
			this.data = data;

			this.updateAdminControls();
			this.attachPublishConfirmation();
			this.fireEvent('contextlyDataLoaded');
		},

		onDataLoadingFailure: function() {
			this.isLoading = false;
			this.error = true;

			this.updateAdminControls();
			this.fireEvent('contextlyDataFailed');
		},

		getData: function() {
			if (!this.isLoaded) {
				return null;
			}

			return this.data;
		},

		setSnippet: function (savedSnippet) {
			this.data.snippet = savedSnippet;
			this.updateAdminControls();
			this.updateWidgetsPreview();
			this.fireEvent('contextlyWidgetUpdated', 'snippet', savedSnippet.id, savedSnippet);
		},

		removeSnippet: function (id) {
			// Get removed snippet if any.
			var removedSnippet = null;
			if (this.data.snippet.id && this.data.snippet.id == id) {
				removedSnippet = this.data.snippet;
			}

			// On empty snippet we still need settings for editor to work properly.
			this.data.snippet = {
				settings: this.data.snippet.settings
			};

			this.updateAdminControls();
			this.updateWidgetsPreview();
			this.fireEvent('contextlyWidgetRemoved', 'snippet', id, removedSnippet);
		},

		setSidebar: function (savedSidebar) {
			this.data.sidebars[savedSidebar.id] = savedSidebar;
			this.fireEvent('contextlyWidgetUpdated', 'sidebar', savedSidebar.id, savedSidebar);
		},

		removeSidebar: function (id) {
			var removedSidebar = null;
			if (this.data.sidebars[id]) {
				removedSidebar = this.data.sidebars[id];
			}

			delete this.data.sidebars[id];

			this.fireEvent('contextlyWidgetRemoved', 'sidebar', id, removedSidebar);
		},

		fireEvent: function (type) {
			// Remove the type of event.
			var args = Array.prototype.slice.call(arguments, 1);

			$(window).triggerHandler(type, args);
		},

		proxy: function (func, context) {
			if (typeof context === 'undefined') {
				context = this;
			}

			return function () {
				return func.apply(context, arguments);
			};
		},

		buildEditorUrl: function (type) {
			var s = Contextly.Settings.getInstance();

			var url = s.getEditorUrl();
			if (url.indexOf('?') === -1) {
				url += '?';
			}
			else {
				url += '&';
			}
			url += 'editor-type=' + encodeURIComponent(type);

			return url;
		},

		snippetPopup: function () {
			this.openEditor('snippet');
		},

		sidebarPopup: function (snippet_id, callback, context) {
			this.openEditor('sidebar', {
				getSidebarId: function () {
					return snippet_id;
				},
				callback: this.proxy(function(savedSidebar) {
					if (callback) {
						context = context || window;
						callback.call(context, savedSidebar);
					}
					this.updateWidgetsPreview();
				})
			});
		},

		linkPopup: function (text, callback, context) {
			this.openEditor('link', {
				callback: this.proxy(function (result) {
					if (callback) {
						context = context || window;
						callback.call(context, result.link_url, result.link_title);
					}
					this.updateWidgetsPreview();
				}),
				getText: function () {
					return text;
				}
			});
		},

		openEditor: function(type, api) {
            if (!this.isLoaded) {
				return;
			}

			if (!this.data) {
				this.showStubPopup();
				return;
			}

			// Extend API with default methods (caller is able to overwrite them).
			api = api || {};
			api = $.extend({
				getSettings: this.proxy(this.getData),
				buildAjaxConfig: this.proxy(this.buildAjaxConfig),
				setSidebar: this.proxy(this.setSidebar),
				removeSidebar: this.proxy(this.removeSidebar),
				setSnippet: this.proxy(this.setSnippet),
				removeSnippet: this.proxy(this.removeSnippet),
				setOverlayCloseButtonHandler: function (callback) {
					Contextly.overlay.setCloseButtonHandler(callback);
				},
				closeOverlay: function () {
					Contextly.overlay.close();
				}
			}, api);

			// Set up event handler to respond on overlay ready events with an API.
			$(window)
				.unbind('contextlyOverlayReady')
				.bind('contextlyOverlayReady', function () {
					return api;
				});

			// Load an iframe inside modal.
			var url = this.buildEditorUrl(type);
			var options = {
				width: {
					max: 1400
				}
			};
			this.openOverlay($('<iframe frameBorder="0"/>').attr({
				src   : url,
				width : '100%',
				height: '100%'
			}), options);
		},

		openOverlay: function(element, options) {
			options = $.extend(true, {
				zIndex: 100000
			}, options);
			Contextly.overlay.open(element, options);
		},

		showStubPopup: function () {
			this.url = this.url || 'http://contextly.com/contact-us/';
			window.open(this.url);
		},

		widgetHasLinks: function(widget) {
			for (var key in widget.links) {
				if (widget.links[key] && widget.links[key].length) {
					return true;
				}
			}

			return false;
		},

		attachPublishConfirmation: function () {
			$('#publish')
				.unbind('click.contextlyPublishConfirmation')
				.bind('click.contextlyPublishConfirmation', this.proxy(function () {
					var wp_settings = Contextly.Settings.getInstance().getWPSettings();

					if (wp_settings.publish_confirmation && this.data !== null) {
						// Put snippet and sidebars together for a check.
						var widgets = $.extend({
							'0': this.data.snippet
						}, this.data.sidebars);

						var linkExists = false;
						for (var key in widgets) {
							if (this.widgetHasLinks(widgets[key])) {
								linkExists = true;
								break;
							}
						}
						if (!linkExists) {
							this.showPublishConfirmation();
							return false;
						}
					}

					return true;
				}));
		},

		updateWidgetsPreview: function() {
			if (this.isUpdateQueued) {
				return;
			}
			this.isUpdateQueued = true;

			setTimeout(this.proxy(function() {
				this.isUpdateQueued = false;
				Contextly.Loader.getInstance().load();
			}), 1);
		},

		showPublishConfirmation: function () {
			$('.button-primary').removeClass('button-primary-disabled');
			$('#ajax-loading').css('visibility', 'hidden');

			var add_links_value = "Choose Related Posts";
			var publish_now_value = $('#publish').attr("value");
			var add_links_class = 'ctx_add_related_links_btn';
			var publish_now_class = 'ctx_publish_now_btn';

			var html = '<div class="ctx_publish_confirmation">' +
				'<h3 class="ctx_confirmation_title">Publish confirmation</h3>' +
				"<div style='float:left; padding-bottom:20px;'>This post doesn't have any chosen links to other posts. Would you like to do that now?<br /><br /> If you want to add a sidebar, close this window, put the cursor where you'd like the sidebar to be and click the sidebar button.</div>" +
				'<input type="button" value="' + add_links_value + '" class="button button-primary ' + add_links_class + '" />' +
				'<input type="button" value="' + publish_now_value + '" class="button ' + publish_now_class + '" style="margin-left: 20px; float: right;" />' +
				'</div>';
			var popupContent = $(html);
			this.openOverlay(popupContent, {
				width: 440,
				height: 'auto'
			});

			// Bind click handlers to buttons.
			popupContent
				.find('input.' + add_links_class)
				.bind('click.contextlyPublishConfirmation', this.proxy(function() {
					Contextly.overlay.close();
					this.snippetPopup();
				}));
			popupContent
				.find('input.' + publish_now_class)
				.bind('click.contextlyPublishConfirmation', function() {
					Contextly.overlay.close();
					$('#publish')
						.unbind('.contextlyPublishConfirmation')
						.click();
				});
		},

		showErrorDetails: function() {
			// TODO Provide more details about the reason if possible (suspended account, etc).
			var html = '<div class="ctx_data_error_details">'
				+ 'We were unable to load Contextly data for this post. Please check your API settings on the Contextly plugin <a href="admin.php?page=contextly_options&tab=contextly_options_api" target="_blank">settings page</a> or <a href="http://contextly.com/contact-us/" target="_blank">contact us</a>.'
				+ '</div>';
			var content = $(html);
			this.openOverlay(content, {
				width: 440,
				height: 'auto'
			});
		},

		updateAdminControls: function () {
			var label,
				callback;

			if (this.error) {
				label = 'Unable to load';
				callback = this.showErrorDetails;
			}
			else {
				callback = this.snippetPopup;
				if (this.widgetHasLinks(this.data.snippet)) {
					label = 'Edit Related Posts';
				} else {
					label = 'Choose Related Posts';
				}
			}

			$('.ctx_snippets_editor_btn')
				.attr('value', label)
				.removeAttr('disabled')
				.unbind('.contextlySnippetEditor')
				.bind('click.contextlySnippetEditor', this.proxy(callback));
		}

	});

	Contextly.PostEditor.getInstance().loadData();

})( jQuery );
