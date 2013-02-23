/**
 * Contextly plugin script for WordPress
 *
 * User: Andrew Nikolaenko
 * Date: 9/20/12
 * Time: 8:58 AM
 */

( function( $ )
{
    $.contextly = {};

    $.contextly.page_entry = null;

    //$.contextly.popup_server_address    = Contextly.popup_server;
    //$.contextly.help_url                = null;

    $.contextly.window_name             = 'contextly-app';
    $.contextly.window_params           = 'width=1150,height=600,resizable=1,scrollbars=1,menubar=1';
    $.contextly.window_provider         = '#easyXDM_linker_channel_provider';

    $.contextly.tinymce_editor          = null;
    $.contextly.tinymce_text            = null;

    //$.contextly.settings                = null;
    //$.contextly.snippet                 = null;

    //$.contextly.snippets                = null;
    //$.contextly.sidebars                = null;

    $.contextly.proxy                   = null;
    //$.contextly.widget_css_loaded       = null;
    //$.contextly.sidebar_css_loaded      = null;

    $.contextly.WIDGET_TYPE_TABS        = 'tabs';
    $.contextly.WIDGET_TYPE_BLOCKS      = 'blocks';

    $.contextly.ERROR_FORBIDDEN = 403;
    $.contextly.ERROR_SUSPENDED = 408;

    $.fn.contextly = {

        init: function ()
        {
            $.fn.contextly.loadPageWidgets();
        },

        restCall: function ( api_name, api_method, params, callback )
        {
            var remote_url = Contextly.api_server + '/easy_xdm/cors/index.html';
            var api_url = Contextly.api_server + api_name + '/' + api_method + '/';

            params = $.extend(
                params,
                {
                    version:Contextly.version,
                    site_path:Contextly.app_id,
                    admin:$.fn.contextly.isAdminRequest(),
                    page_id:$.fn.contextly.getPageId()
                }
            );

            var rpc = new easyXDM.Rpc({
                    remote: remote_url
                },
                {
                    remote: {
                        request: {}
                    }
                });

            rpc.request(
                {
                    url: api_url,
                    method: "POST",
                    data: params
                },
                function ( response )
                {
                    $.fn.contextly.restCallback( response, callback )
                }
            );
        },

        restCallback: function ( response, callback )
        {
            $.fn.contextly.restDebug( response )

            callback( response );
        },

        restDebug: function ( response )
        {
            if ( !response.data ) return;

            var data = easyXDM.getJSONObject().parse( response.data );

            if ( data.q ) {
				if ( data.t ) console.log( 'Time: ' + data.t );
				if ( data.m ) console.log( 'Memory: ' + data.m );
                for ( var i in data.q ) {
                    console.log( data.q[ i ] );
                }
            }
        },

        loadPageWidgets: function ()
        {
            $.fn.contextly.restCall(
                'pagewidgets',
                'get',
                {},
                function ( response )
                {
                    if ( response.data )
                    {
                        var json_data = easyXDM.getJSONObject().parse( response.data );
                        $.fn.contextly.processLoadWidgetsResponse( json_data );
                    }
                }
            );
        },

        processLoadWidgetsResponse: function ( response ) {
            $.contextly.page_entry = new ContextlyPageEntry( response );
            $.contextly.page_entry.displaySnippets();
            $.contextly.page_entry.displaySidebars();

            /*
            if ( response.error && $.fn.contextly.isAdminRequest() ) {
                var message = '';
                var help_url = 'http://contextly.com/contact-us/';

                if ( response.error ) {
                    if ( response.error_code == $.contextly.ERROR_FORBIDDEN ) {
                        message = response.error + " Please check your API settings on the Contextly plugin <a href='admin.php?page=contextly_options&tab=contextly_options_api'>Settings</a> page.";
                    } else if ( response.error_code == $.contextly.ERROR_SUSPENDED ) {
                        message = "Your account has been suspended. If this is an error, please contact us via <a href='http://contextly.com/contact-us/'>support@contextly.com</a>.";
                    } else {
                        help_url = "admin.php?page=contextly_options&tab=contextly_options_api";
                        message = "Please check your API settings on the Contextly plugin <a href='admin.php?page=contextly_options&tab=contextly_options_api'>Settings</a> page.";
                    }
                } else {
                    message = "Sorry, something seems to be broken. Please contact us via <a href='http://contextly.com/contact-us/'>support@contextly.com</a>.";
                }

                $.fn.contextly.displayHtml( message );
                $.contextly.help_url = help_url;
            } else {

                var pageEntry = new ContextlyPageEntry( response );


                if ( response.entry && response.entry.snippets ) {
                    $.contextly.snippets = response.entry.snippets;
                    $.fn.contextly.displaySnippets();
                }

                if ( response.entry && response.entry.sidebars ) {
                    $.contextly.sidebars = response.entry.sidebars;
                    $.fn.contextly.displaySidebars();
                }

                // If this is admin response, we need to add some controls
                if ( $.fn.contextly.isAdminRequest() ) {
                    $.fn.contextly.appendAdminControls();
                }
            }
            */
        },
/*
        displaySnippets: function () {
            var snippets = $.contextly.snippets;

            for ( var idx in snippets ) {
                $.fn.contextly.displaySnippet( snippets[ idx ] )
            }
        },

        displaySnippet: function ( snippet ) {
            if ( snippet.settings ) {
                var settings = snippet.settings;
                var widget;

                if ( settings.display_type == $.contextly.WIDGET_TYPE_TABS ) {
                    widget = new HTMLWidget( snippet, settings );
                }
                else if ( settings.display_type == $.contextly.WIDGET_TYPE_BLOCKS ) {
                    widget = new HTMLBlocks( snippet, settings );
                }
                else {
                    widget = new TextWidget( snippet, settings );
                }

                $.fn.contextly.displayHtml( widget.getHTML() );
            }
        },

        hasSnippetLinks: function () {
            var snippets = $.contextly.snippets;

            if ( snippets && snippets.length ) {
                var snippet = snippets[0];

                if ( snippet.links ) return true;
            }

            return false;
        },

        appendAdminControls: function ()
        {
            var html;

            if ($.fn.contextly.hasSnippetLinks() ) {
                html = "<br><input type='button' class='button action' value='Edit See Also' onclick='jQuery.fn.contextly.openPopup();' />";
            } else {
                html = "<input type='button' class='button action' value='Create See Also' onclick='jQuery.fn.contextly.openPopup();' />";
            }

            $( '#linker_widget' ).append( html );
        },

        displaySidebars: function () {
            var sidebars = $.contextly.sidebars;
        },
        */

        /*
        loadPageSnippet: function ()
        {
            var admin = $.fn.contextly.isAdminRequest();
            var page_id = $.fn.contextly.getPageId();

            $.fn.contextly.restCall(
                'snippets',
                'get',
                {},
                function ( response )
                {
                    if ( response.data )
                    {
                        var json_data = easyXDM.getJSONObject().parse( response.data );
                        $.fn.contextly.displaySnippet( json_data );
                    }
                }
            );
        },

        displaySnippet: function ( data )
        {
            if ( data.entry && data.entry.settings ) {
                $.contextly.snippet = data.entry;
                $.contextly.settings = data.entry.settings;
            }

            if ( !data.error ) {
                $.fn.contextly.processSnippetResponse( data );
            } else if ( $.fn.contextly.isAdminRequest() ) {
                var message = '';
                var help_url = 'http://contextly.com/contact-us/';

                if ( data.error ) {
                    if ( data.error_code == $.contextly.ERROR_FORBIDDEN ) {
                        message = data.error + " Please check your API settings on the Contextly plugin <a href='admin.php?page=contextly_options&tab=contextly_options_api'>Settings</a> page.";
                    } else if ( data.error_code == $.contextly.ERROR_SUSPENDED ) {
                        message = "Your account has been suspended. If this is an error, please contact us via <a href='http://contextly.com/contact-us/'>support@contextly.com</a>.";
                    } else {
                        help_url = "admin.php?page=contextly_options&tab=contextly_options_api";
                        message = "Please check your API settings on the Contextly plugin <a href='admin.php?page=contextly_options&tab=contextly_options_api'>Settings</a> page.";
                    }
                } else {
                    message = "Sorry, something seems to be broken. Please contact us via <a href='http://contextly.com/contact-us/'>support@contextly.com</a>.";
                }

                $.fn.contextly.displayHtml( message );
                $.contextly.help_url = help_url;
            }
        },

        processSnippetResponse: function processNormalResponse ()
        {
            var html = '';

            if ( $.contextly.snippet && $.contextly.settings )
            {
                var snippet = $.contextly.snippet;
                var settings = $.contextly.settings;
                var widget;

                if ( settings.display_type == $.contextly.WIDGET_TYPE_TABS )
                {
                    widget = new HTMLWidget( snippet, settings );
                }
                else if ( settings.display_type == $.contextly.WIDGET_TYPE_BLOCKS )
                {
                    widget = new HTMLBlocks( snippet, settings );
                }
                else
                {
                    widget = new TextWidget( snippet, settings );
                }

                html = widget.getHTML();
            }

            $.fn.contextly.updatePost();
            $.fn.contextly.displayHtml( html );

            // If this is admin response, we need to add some controls
            if ( $.fn.contextly.isAdminRequest() ) {
                $.fn.contextly.appendAdminControls();
            }
        },


        isCssLoaded: function ( settings )
        {
            return ( $.contextly.widget_css_loaded == settings.tabs_style );
        },

        loadSettingsCss: function ( settings )
        {
            if ( settings.display_type == $.contextly.WIDGET_TYPE_TABS || settings.display_type == $.contextly.WIDGET_TYPE_BLOCKS )
            {
                //$.fn.contextly.loadWidgetCssTemplate( 'widget', settings.tabs_style );
                //$.fn.contextly.buildWidgetCustomCss( '.contextly-widget', settings );

                $.contextly.widget_css_loaded = settings.tabs_style;
            }
        },

        isSidebarCssLoaded: function ()
        {
            return $.contextly.sidebar_css_loaded;
        },

        loadSidebarSettingsCss: function ( settings )
        {
            //$.fn.contextly.loadSidebarCssTemplate( 'sidebar', settings.tabs_style || settings.theme );
            //$.fn.contextly.buildWidgetCustomCss( '.contextly-sidebar', settings );

            $.contextly.sidebar_css_loaded = true;
        },

        stringToDate: function( mysql_date ) {
            var dateParts = mysql_date.split(' ')[0].split('-');
            var timeParts = mysql_date.split(' ')[1].split(':');
            var date = new Date(dateParts[0], dateParts[1], dateParts[2]);
            date.setHours(timeParts[0], timeParts[1], timeParts[2])

            return date;
        },

        updatePost: function (  )
        {
            var update = false;
            var snippet = $.contextly.snippet;

            // Now we can check last post publish date and probably we need to publish/update this post in our db
            if ( !snippet ) update = true;
            else if ( snippet ) {
                if ( !snippet.publish_date ) {
                    update = true;
                } else if ( snippet.publish_date != Contextly.post.post_modified ) {
                    var post_date = $.fn.contextly.stringToDate( Contextly.post.post_modified );
                    var cur_date = new Date().getTime();

                    var diff = Math.abs( ( cur_date - post_date ) / 1000 );
                    var allowed_diff = 60 * 60 * 24 * 365; // 1 year

                    // Allow for update only fresh posts
                    if ( diff <= allowed_diff ) {
                        update = true;
                    }
                }
            }

            if ( update ) {
                $.fn.contextly.publishCurrentPost();
            }
        },

        publishCurrentPost: function ()
        {
            var page_id = $.fn.contextly.getPageId();

            var data = {
                action: 'contextly_publish_post',
                page_id: page_id
            };

            $.ajax({
                url: Contextly.ajax_url,
                type: 'post',
                dataType: 'json',
                data: data,
                success: function() {
                }
            });
        },

        displayHtml: function ( html )
        {
            $( '#linker_widget' ).html( html );
            $( '#linker_widget').addClass( 'contextly-widget' );

            // Check if we want to change widget position
            if ( !$.fn.contextly.isAdminRequest() )
            {
                // We need to be sure that our control is last in content element
                if (!jQuery("#linker_widget").is(":last-child")) {
                    jQuery("#linker_widget").parent().append(jQuery("#linker_widget"));
                }

                // Check for a custom position on page
                if (typeof Contextly.settings != "undefined" && typeof Contextly.settings.target_id != "undefined" && Contextly.settings.target_id) {
                    if (typeof Contextly.settings.block_position != "undefined" && Contextly.settings.block_position == "before") {
                        jQuery("#linker_widget").insertBefore(jQuery("#" + Contextly.settings.target_id));
                    } else if (Contextly.settings.target_id) {
                        jQuery("#linker_widget").insertAfter(jQuery("#" + Contextly.settings.target_id));
                    }
                }
            }
        },


        loadWidgetCssTemplate: function ( type, template_type )
        {
            if ( Contextly.mode == 'local' ) {
                var css_url = "http://linker.site/resources/css/plugin/" + type + "/" + $.contextly.settings.display_type + "/template-" + template_type + ".css";
            } else if ( Contextly.mode == 'dev' ) {
                var css_url = "http://dev.contextly.com/resources/css/plugin/" + type + "/" + $.contextly.settings.display_type + "/template-" + template_type + ".css";
            } else {
                var css_url = "http://contextlysiteimages.contextly.com/_plugin/"  + Contextly.version +  "/css-api/" + type + "/" + $.contextly.settings.display_type + "/template-" + template_type + ".css";
            }

            $.fn.contextly.loadCss( css_url );

            // If this is IE7 we need to load IE7 css fix
            if( $.browser.msie && parseFloat( $.browser.version ) < 8 )
            {
                $.fn.contextly.loadWidgetCssIE7Fix();
            }
        },

        loadSidebarCssTemplate: function ( type, template_type )
        {
            if ( Contextly.mode == 'local' ) {
                var css_url = "http://linker.site/resources/css/plugin/" + type + "/template-" + template_type + ".css";
            } else if ( Contextly.mode == 'dev' ) {
                var css_url = "http://dev.contextly.com/resources/css/plugin/" + type + "/template-" + template_type + ".css";
            } else {
                var css_url = "http://contextlysiteimages.contextly.com/_plugin/"  + Contextly.version +  "/css-api/" + type + "/template-" + template_type + ".css";
            }

            $.fn.contextly.loadCss( css_url );

            // If this is IE7 we need to load IE7 css fix
            if( $.browser.msie && parseFloat( $.browser.version ) < 8 )
            {
                $.fn.contextly.loadWidgetCssIE7Fix();
            }
        },

        loadWidgetCssIE7Fix: function ()
        {
            var css_url = "http://contextlysiteimages.contextly.com/_plugin/"  + Contextly.version +  "/css/template-ie-fix.css";
            $.fn.contextly.loadCss( css_url );
        },

        loadCss: function ( css_url )
        {
            jQuery( "head" ).append( "<link>" );
            var css_node = jQuery( "head" ).children( ":last" );
            css_node.attr({
                rel:    "stylesheet",
                media:  "screen",
                type:   "text/css",
                href:   css_url
            });
        },

        buildWidgetCustomCss: function ( entry, settings )
        {
            var css_builder = new CssCustomBuilder();
            var custom_css = css_builder.buildCSS( entry, settings );

            if ( custom_css )
            {
                jQuery( "head" ).append( jQuery( "<style type='text/css'>" + custom_css + "</style>" ) );
            }
        },

        switchTab: function ( tab )
        {
            jQuery("#linker_content_previous,#linker_content_web,#linker_content_interesting").hide();
            jQuery("#linker_tab_previous,#linker_tab_web,#linker_tab_interesting").attr( "class", "" );
            jQuery("#linker_content_" + tab).show();
            jQuery("#linker_tab_" + tab).attr( "class", "active" );

            $.fn.contextly.addPageEvent( "switch_tab", tab );
        },

        showMore: function ( tab )
        {
            jQuery( '.li' + tab ).toggleClass( "show" );
            var pmore = jQuery( '#pmore' + tab );
            pmore.toggleClass("show");

            if (pmore.hasClass('show')) {
                pmore.find('a').text('Show Less');
            } else {
                pmore.find('a').text('Show More');
            }

            $.fn.contextly.addPageEvent( "show_more", tab );
        },

        addPageEvent: function ( event_name, event_key )
        {
            var page_id     = $.fn.contextly.getPageId();
            var setting_id  = $.contextly.settings.id;

            var event_data = {
                'post_id': page_id,
                'setting_id': setting_id,
                'event_name': event_name,
                'event_key': event_key,
                'event_date': new Date()
            };

            $.fn.contextly.restCall(
                'siteevents',
                'put',
                event_data,
                function ( response ) {}
            );
        },

        isAdminRequest: function ()
        {
            return parseInt( Contextly.admin );
        },

        getPageId: function ()
        {
            return Contextly.post.post_id;
        },

        getApiKey: function ()
        {
            return Contextly.api_key;
        },
*/
        openPopup: function ()
        {
            var page_id     = $.fn.contextly.getPageId();
            var author_id   = userSettings.uid;

            if ( settings_id ) {
                var window_url = $.contextly.popup_server_address;
                window_url += 'sites/' + Contextly.app_id + '/';
                window_url += '?page_id=' + page_id;
                window_url += '&author=' + author_id;
                window_url += '&edit_snippet_id=' + ( snippet_id ? snippet_id : '' );
                window_url += $.contextly.window_provider;

                window.open(
                    window_url,
                    $.contextly.window_name,
                    $.contextly.window_params
                );

                $.contextly.proxy = new easyXDM.Socket(
                    {
                        onMessage: function( data, origin ) {
                            jQuery.fn.contextly.loadPageWidgets();
                        },
                        channel: "linker_channel",
                        remote: $.contextly.popup_server_address + "resources/html/remote.html"
                    }
                );
            }
            else
            {
                window.open( $.contextly.help_url );
            }
        },

        openTinyMceLinkPopup: function ()
        {
            var settings    = $.contextly.settings;
            var page_id     = $.fn.contextly.getPageId();
            var snippet     = $.contextly.snippet;

            if ( settings )
            {
                var window_url = $.contextly.popup_server_address;
                window_url += 'sites/' + settings.site_path + '/';
                window_url += '?page_id=' + page_id;
                window_url += '&edit_snippet_id=' + ( snippet ? snippet.id : '' );
                window_url += "&tinymce_link_text=" + $.contextly.tinymce_text;
                window_url += $.contextly.window_provider;

                window.open(
                    window_url,
                    $.contextly.window_name,
                    $.contextly.window_params
                );

                $.contextly.proxy = new easyXDM.Socket(
                    {
                        onMessage: function( data, origin ) {
                            jQuery.fn.contextly.loadPageWidgets();
                            jQuery.fn.contextly.createTinymceLink( data );
                        },
                        channel: "linker_channel",
                        remote: $.contextly.popup_server_address + "resources/html/remote.html"
                    }
                );
            }
            else
            {
                window.open( $.contextly.help_url );
            }
        },

        createTinymceLink: function ( response )
        {
            if ( response ) {
                var json = jQuery.parseJSON( response );

                if (json.status == "ok") {
                    var ed = jQuery.contextly.tinymce_editor;

                    var attrs = {
                        href : json.link_url,
                        title : json.link_title
                    }, e;
                    e = ed.dom.getParent(ed.selection.getNode(), 'A');
                    if ( ! attrs.href || attrs.href == 'http://' ) return;
                    if (e == null) {
                        ed.getDoc().execCommand("unlink", false, null);
                        ed.getDoc().execCommand("CreateLink", false, "#mce_temp_url#", {skip_undo : 1});
                        tinymce.each(ed.dom.select("a"), function(n) {
                            if (ed.dom.getAttrib(n, 'href') == '#mce_temp_url#') {
                                e = n;
                                ed.dom.setAttribs(e, attrs);
                            }
                        });
                        if ( jQuery(e).text() == '#mce_temp_url#' ) {
                            ed.dom.remove(e);
                            e = null;
                        }
                    } else {
                        ed.dom.setAttribs(e, attrs);
                    }
                    if ( e && (e.childNodes.length != 1 || e.firstChild.nodeName != 'IMG') ) {
                        ed.focus();
                        ed.selection.select(e);
                        ed.selection.collapse(0);
                    }
                } else if (json.status == "error") {
                    alert(json.message);
                }
            }
        },

        openSidebarPopup: function ( sidebar_id )
        {
            var settings    = $.contextly.settings;
            var page_id     = $.fn.contextly.getPageId();
            var snippet     = $.contextly.snippet;

            if ( settings )
            {
                var window_url = $.contextly.popup_server_address;
                window_url += 'sites/' + settings.site_path + '/sidebar/';
                window_url += '?page_id=' + page_id;
                window_url += '&sidebar_id=' + ( sidebar_id ? sidebar_id : '' );
                window_url += $.contextly.window_provider;

                window.open(
                    window_url,
                    $.contextly.window_name,
                    $.contextly.window_params
                );

                if ( $.contextly.proxy != null ) $.contextly.proxy.destroy();

                $.contextly.proxy = new easyXDM.Socket(
                    {
                        onMessage: function( data, origin )
                        {
                            if ( data )
                            {
                                var json = eval("(" + data + ")");
                                if ( json.status == "ok" && json.snippet_id )
                                {
                                    if ( json.snippet_id != sidebar_id )
                                    {
                                        jQuery.fn.contextly.insertSidebarShortcode( json.snippet_id );
                                    }
                                }

                                $.contextly.proxy.destroy();
                            }
                        },
                        channel: "linker_channel",
                        remote: $.contextly.popup_server_address + "resources/html/remote.html"
                    }
                );
            }
            else
            {
                window.open( $.contextly.help_url );
            }
        },

        insertSidebarShortcode: function ( sidebar_id )
        {
            send_to_editor( '[contextly_sidebar id="' + sidebar_id + '"]' );
        }

        /*
        loadSidebar: function ( sidebar_id )
        {
            var admin       = $.fn.contextly.isAdminRequest();
            var page_id     = $.fn.contextly.getPageId();

            if ( page_id )
            {
                $.fn.contextly.restCall(
                    'sidebars',
                    'get',
                    {
                        id: sidebar_id
                    },
                    function ( response )
                    {
                        if ( response.data )
                        {
                            var json_data = easyXDM.getJSONObject().parse( response.data );
                            $.fn.contextly.displaySidebar( json_data );
                        }
                    }
                );
            }
        },

        displaySidebar: function ( data )
        {
            if ( !data.entry || !data.entry.settings ) return;

            var snippet     = data.entry;
            var settings    = data.entry.settings;

            if ( !snippet ) return;

            var widget = new HtmlSidebarWidget( snippet, settings );
            var html = widget.getHTML();
            var sidebar = $( '#' + snippet.id );

            sidebar
                .html( html )
                .removeClass( 'contextly-sidebar-hidden' )
                .addClass( 'contextly-sidebar' )
                .addClass( 'contextly-sidebar-' + snippet.layout )
                        .addClass( 'contextly-widget' );

            // Check if we need to add sidebar title and description
            var title = snippet.name;
            var description = snippet.description;
            var sidebar_content = sidebar.find( '.linker_content' );

            if ( description ) sidebar_content.prepend( "<div class='description'>" + description + "</div>" );
            if ( title ) sidebar_content.prepend( "<div class='title'>" + title + "</div>" );

            sidebar.show();
        },

        loadPageSidebars: function( )
        {
            jQuery( "div.contextly-sidebar-hidden").each(
                function ()
                {
                    var sidebar_id = jQuery( this ).attr( 'id' );
                    jQuery.fn.contextly.loadSidebar( sidebar_id );
                }
            );
        }
        */

    };

    $.fn.contextly.init();

})( jQuery );

///////////////////////////////////////////////////////////////////////////////////////
//                       Class for manage page response                              //
///////////////////////////////////////////////////////////////////////////////////////
/*

var ContextlyPageEntry = createClass({
    construct: function ( rest )
    {
        this.entry = null;
        this.error = null;

        this.admin = Contextly.admin;
        this.post_modified = Contextly.post.post_modified;
        this.popup_server_url = Contextly.popup_server;

        if ( rest.entry ) {
            this.entry = entry;
        } else if ( rest.error ) {
            this.error = rest;
        }
    },

    displaySnippets: function () {
        if ( this.entry.snippets ) {
            var snippets = this.entry.snippets;

            for ( var idx in snippets ) {
                this.displaySnippet( snippets[ idx ] )
            }
        }
    },

    displaySnippet: function ( snippet ) {
        if ( snippet.settings ) {
            var settings = snippet.settings;
            var widget;

            if ( settings.display_type == $.contextly.WIDGET_TYPE_TABS ) {
                widget = new HTMLWidget( snippet, settings );
            }
            else if ( settings.display_type == $.contextly.WIDGET_TYPE_BLOCKS ) {
                widget = new HTMLBlocks( snippet, settings );
            }
            else {
                widget = new TextWidget( snippet, settings );
            }

            $.fn.contextly.displayHtml( widget.getHTML() );
        }
    },


    displaySidebars: function () {



    },

    display: function () {
        if ( this.error ) {
            this.process
        }
    },

    getSnippets: function ()
    {
        if ( this.entry.snippets ) {
            return this.entry.snippets;
        }

        return null;
    },

    getSidebars: function ()
    {
        if ( this.entry.sidebars ) {
            return this.entry.sidebars;
        }

        return null;
    },

    getSnippetHTML: function ()
    {

    }



});
*/

///////////////////////////////////////////////////////////////////////////////////////
//                       Classes for make HTML Widget                                //
///////////////////////////////////////////////////////////////////////////////////////
/*
var BaseWidget = createClass({
    construct: function( snippet, settings )
    {
        this.snippet = snippet;
        this.settings = settings;
    },
    isDisplaySection: function ( section )
    {
        var display_section = jQuery.inArray( section, this.settings.display_sections ) != -1;
        var have_to_display = this.snippet.links && this.snippet.links[ section ] && this.snippet.links[ section ].length > 0;

        return display_section && have_to_display;
    },
    getHTML: function()
    {
        // With display CSS we need to be sure that we have loaded CSS template
        if ( !jQuery.fn.contextly.isCssLoaded( this.settings ) )
        {
            jQuery.fn.contextly.loadSettingsCss( this.settings );
        }

        return this.buildHTML();
    }

});

var TextWidget = createClass({
    extend: BaseWidget,
    buildHTML: function ()
    {
        var div = "";
        var value;

        div += "<div class='contextly_see_also'>";
        // Check for top links html
        if ( value = this.settings.html_above ) {
            div += "<div class='contextly_html_above'>" + value + "</div>";
        }
        // Check for title
        if ( value = this.settings.title ) {
            div += "<div class='contextly_title'>" + value + "</div>";
        }

        div += "<div class='contextly_around_site'>";
        if ( this.isDisplaySection( "previous" ) ) {
            div += "<div class='contextly_previous'>";
            div += "<span class='contextly_subhead'>" + this.settings.previous_subhead + "</span>";
            div += "<ul>" + this.getLinksHTMLOfType( 'previous' ) + "</ul>";
            div += "</div>";
        }
        div += "</div>";

        if ( this.isDisplaySection( "web" ) ) {
            div += "<div class='contextly_around_web'>";
            div += "<span class='contextly_subhead'>" + this.settings.web_subhead + "</span>";
            div += "<ul>" + this.getLinksHTMLOfType( 'web' ) + "</ul>";
            div += "</div>";
        }

        if ( this.isDisplaySection( "interesting" ) ) {
            div += "<div class='contextly_around_interesting'>";
            div += "<span class='contextly_subhead'>" + this.settings.interesting_subhead + "</span>";
            div += "<ul>" + this.getLinksHTMLOfType( 'interesting' ) + "</ul>";
            div += "</div>";
        }
        div += "</div>";

        return div;
    },
    getLinkHTML: function ( link )
    {
        return "<li><a href=\"" + link.native_url + "\" title=\"" + link.title + "\" onmousedown=\"this.href='" + link.url + "'\" onclick=\"javascript:return(true)\">" + link.title + "</a><!--[if lte ie 7]><b></b><![endif]--></li>";
    },
    getLinksHTMLOfType: function( type )
    {
        var html = "";

        if ( this.snippet.links && this.snippet.links[ type ] )
        {
            for ( var link_idx in this.snippet.links[ type ] )
            {
                var link = this.snippet.links[ type ][ link_idx ];

				if ( link.id && link.title )
				{
					html += this.getLinkHTML( link );
				}
            }
        }

        return html;
    }

});

var HTMLWidget = createClass({
    extend: BaseWidget,
    buildHTML: function ()
    {
        var div = "";
        var sections = this.settings.display_sections;

        if ( value = this.settings.html_above ) {
            div += "<span class=\"contextly_above_related\">" + value + "</span>";
        }

        div += "<ul class=\"linker_tabs\">";
        var active_flag = false;

        for ( var section in sections )
        {
            var section_name = sections[section];

            if ( this.isDisplaySection( section_name ) ) {
                var section_key = section_name + '_subhead';
                var section_header = this.settings[ section_key ];

                div += "<li id='linker_tab_" + section_name + "' " + (!active_flag ? "class='active'" : "") + ">";
                div += "<a href='javascript:;' onclick='jQuery.fn.contextly.switchTab(\"" + section_name + "\")'><span>" + section_header + "</span></a>";
                div += "</li>";
                active_flag = true;
            }
        }

        if ( this.isDisplayContextlyLogo() )
        {
            div += "<li><span class='contextly_related'><a href='http://contextly.com'>Related Links by Contextly</a></span></li>";
        }

        div += "</ul>";

        var active_flag = false;
        for (var section in sections) {
            var section_name = sections[section];
            if ( this.isDisplaySection( section_name ) ) {
                div += "<div id='linker_content_" + section_name + "' class='linker_content' " + (!active_flag ? "style='display: block;'" :"") + ">"
                    + "<ul class='link " + ( this.hasImagesForLinks( section_name ) ? 'linker_images' : '' ) + " '>"
                    + this.getLinksHTMLOfType( section_name )
                    + "</ul>"
                    + "</div>";
                active_flag = true;
            }
        }

        div += "</div>";

        return div;
    },
    getLinksHTMLOfType: function( type )
    {
        var html = "";

        if ( this.snippet.links && this.snippet.links[ type ] )
        {
            for ( var link_idx in this.snippet.links[ type ] )
            {
                var link = this.snippet.links[ type ][ link_idx ];

				if ( link.id && link.title )
				{
					html += "<li " + ( ( parseInt( link_idx ) + 1 ) > this.settings.links_limit ? "class='li" + type +"'" : "" ) + ">";
					html += this.getLinkHTML( link );
					html += "</li>";
				}
            }

            if ( this.snippet.links[ type ].length > this.settings.links_limit )
            {
                html += "<p class=\"show-more\" id=\"pmore" + type + "\"><a href=\"javascript:jQuery.fn.contextly.showMore('" + type + "');\" name=\"amore" + type + "\">Show More</a></p>";
            }
        }

        return html;
    },
    getLinkHTML: function ( link )
    {
        var item_style = "padding-bottom: 5px;";

        if ( link.thumbnail_url )
        {
            item_style += "height: " + this.getImagesHeight() + "px;";
        }

        var html = "<ul class='horizontal-line' style='" + item_style + "'>";
        var a_href = "<a class=\"title module-contextly\" href=\"" + link.native_url + "\" title=\"" + link.title + "\" onmousedown=\"this.href='" + link.url + "'\" onclick=\"javascript:return(true)\">";
        var ie_fix = "<!--[if lte ie 7]><b></b><![endif]-->";

        if ( link.thumbnail_url )
        {
            var image_li_width = this.getImagesWidth() + 8;
            html += "<li style='width: " + image_li_width + "px;'>" + a_href + "<img src='" + link.thumbnail_url + "' /></a>" + ie_fix + "</li>";
        }

        html += "<li>" + a_href + link.title + "</a>";

        if ( this.settings.display_link_dates && link.publish_date )
        {
            html += " <span class='link-pub-date'>" + this.dateTextDescription( link.publish_date ) + "</span>";
        }

        html += ie_fix + "</li>";
        html += "</ul>";

        return html;
    },
    dateTextDescription: function ( date )
    {
        if ( date && date.length > 4 )
        {
            var t = date.split(/[- :]/);
            var js_date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

            var timestamp = js_date.getTime() / 1000;
            var difference = new Date().getTime()/1000 - timestamp;

            var periods = new Array("sec", "min", "hour", "day", "week", "month", "year", "decade");
            var lengths = new Array("60","60","24","7","4.35","12","10");
            var ending;

            if (difference > 0) {
                // this was in the past
                ending = "ago";
            } else { // this was in the future
                return 'right now';
            }

            for (var j = 0; difference >= lengths[j]; j++) difference /= lengths[j];
                difference = Math.round(difference);

            if (difference != 1) periods[j] += "s";
            return difference + "&nbsp;" +periods[j] + "&nbsp;" + ending;
        }
    },
    hasImagesForLinks: function( type )
    {
        var img_count = 0;

        if ( !this.snippet ) return;

        for ( var link_idx in this.snippet.links[ type ] )
        {
            if ( this.snippet.links[ type ][ link_idx ].thumbnail_url ) img_count++;
        }

        if ( this.snippet.links[ type ].length == img_count ) return true;
    },
    getImagesHeight: function ()
    {
        switch ( this.settings.images_type ) {
            case 'letter82x32':
                return 32;
            case 'letter82x45':
                return 45;
            case 'letter110x90':
                return 90;
            case 'square32x32':
                return 32;
            case 'square45x45':
                return 45;
            case 'square70x70':
                return 70;
            case 'square90x90':
                return 90;
            case 'square110x110':
                return 110;
            default:
                return 0;
        }
    },
    getImagesWidth: function ()
    {
        switch ( this.settings.images_type ) {
            case 'letter82x32':
                return 82;
            case 'letter82x45':
                return 82;
            case 'letter110x90':
                return 110;
            case 'square32x32':
                return 32;
            case 'square45x45':
                return 45;
            case 'square70x70':
                return 70;
            case 'square90x90':
                return 90;
            case 'square110x110':
                return 110;
            default:
                return 0;
        }
    },
    isDisplayContextlyLogo: function()
    {
        return !this.isAdminRequest() && !this.isMobileRequest();
    },
    isAdminRequest: function()
    {
        return jQuery.fn.contextly.isAdminRequest();
    },
    isMobileRequest: function()
    {
        return false; // TODO: implement this method
    }

});

var HTMLBlocks = createClass({
    extend: HTMLWidget
});

var CssCustomBuilder = createClass({

    buildCSS: function ( entry, settings )
    {
        var css_code = "";

        if ( settings.csscode ) css_code += settings.csscode;

        if ( settings.fontfamily ) css_code += this.buildCSSRule( entry, ".link a" , "font-family", settings.fontfamily );
        if ( settings.fontsize ) css_code += this.buildCSSRule( entry, ".link a" , "font-size", settings.fontsize );

        if ( settings.font_family ) css_code += this.buildCSSRule( entry, ".link a" , "font-family", settings.font_family );
        if ( settings.font_size ) css_code += this.buildCSSRule( entry, ".link a" , "font-size", settings.font_size );

        if ( settings.color_background )
        {
            css_code += this.buildCSSRule( entry, ".linker_content" , "background-color", settings.color_background );
            css_code += this.buildCSSRule( entry, ".linker_images img" , "border-color", settings.color_background );
        }

        if ( settings.color_links )
        {
            css_code += this.buildCSSRule( entry, ".linker_content a" , "color", settings.color_links );
            css_code += this.buildCSSRule( entry, ".linker_content span" , "color", settings.color_links );
        }

        if ( settings.color_border )
        {
            css_code += this.buildCSSRule( entry, ".linker_content" , "border-color", settings.color_border );
            css_code += this.buildCSSRule( entry, ".linker_tabs li.active span" , "border-color", settings.color_border );
            css_code += this.buildCSSRule( entry, ".linker_tabs span" , "border-color", settings.color_border );
        }

        if ( settings.color_active_tab ) css_code += this.buildCSSRule( entry, ".linker_tabs li.active span" , "background", settings.color_active_tab );

        if ( settings.color_inactive_tab ) css_code += this.buildCSSRule( entry, ".linker_tabs span" , "background", settings.color_inactive_tab );

        return css_code;
    },

    buildCSSRule: function( entry, prefix, property, value )
    {
        if ( !value ) return "";
        return entry + " " + prefix + " {" + property + ": " + value + "}";
    }

});

var HtmlSidebarWidget = createClass({
    extend: HTMLWidget,
    buildHTML: function()
    {
        var div = "<div class='linker_content'>";

        div += "<ul class='link " + ( this.hasImagesForLinks( 'previous' ) ? 'linker_images' : '' ) + " '>"
                + this.getLinksHTMLOfType( 'previous' )
                + "</ul>";
        div += "</div>";

        // With display CSS we need to be sure that we have loaded CSS template
        if ( !jQuery.fn.contextly.isSidebarCssLoaded() )
        {
            jQuery.fn.contextly.loadSidebarSettingsCss( this.settings );
        }

        return div;
    },
    getLinksHTMLOfType: function( type )
    {
        var html = "";

        if ( this.snippet && this.snippet.links && this.snippet.links[ type ] )
        {
            for ( var link_idx in this.snippet.links[ type ] )
            {
                var link = this.snippet.links[ type ][ link_idx ];

				if ( link.id && link.title )
				{
					html += "<li>";
					html += this.getLinkHTML( link );
					html += "</li>";
				}
            }
        }

        return html;
    }

});
*/
