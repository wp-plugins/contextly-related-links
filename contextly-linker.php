<?php
/**
 * @package Contextly_Linker
 * @version 1.0.63
 */
/*
Plugin Name: Contextly Linker
Plugin URI: http://contextly.com
Description: Adds the Contextly related links tool to your blog. Contextly lets you create related links that helps your readers find more to read, increases your page views and shows off your best content.
Author: Contextly
Version: 1.0.63
*/

function contextly_get_plugin_url() {
	return "http://contextlysitescripts.contextly.com/plugin/linker-plugin.js?version=1.0.63";
}

function contextly_linker_widget_html($admin = false) {
	$inline_html_code = "";
	if ($admin) {
		$inline_html_code = "Loading data from <a target='_blank' href='http://contextly.com'>contextly.com</a>, please wait...";
	}
	return "<div id='linker_widget'>" . $inline_html_code . "</div>";
}

function contextly_linker_widget_html_print() {
	echo contextly_linker_widget_html(true);
}

// Display linker widget for a post page
function contextly_linker_widget($content) {
	if (is_single()) {
		return $content . contextly_linker_widget_html();
	} else {
		return $content;
	}
}
add_action('the_content', 'contextly_linker_widget');

function contextly_add_see_also_meta_box() {
    add_meta_box(
    	'contextly_linker_sectionid',
    	__( 'Create See Also', 'contextly_linker_textdomain' ),
        'contextly_linker_widget_html_print',
        'post',
        'side',
        'low'
    );

    global $ctxActivate;
    if (isset($ctxActivate)) {
    	$ctxActivate->initSettings();
    }
}

function contextly_addbuttons() {
	wp_enqueue_script('jquery');

	// Don't bother doing this stuff if the current user lacks permissions
	if (! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) return;

	// Add only in Rich Editor mode
	if ( get_user_option('rich_editing') == 'true') {
		add_filter("mce_external_plugins", "add_contextly_tinymce_plugin");
		add_filter('mce_buttons', 'register_contextly_button');
	}
}

function register_contextly_button($buttons) {
	$options = get_option('contextly_options_advanced');

	// Now we need to add contextly link btn at position of native link button
	if (is_array($buttons) && count($buttons) > 0) {
		foreach ($buttons as $btn_idx => $button) {
			if ($button == "link") {
				if ($options['link_type'] == "override") {
					$buttons[$btn_idx] = "contextlylink";
				} else {
					array_splice($buttons, $btn_idx, 0, "contextlylink");
				}
			}
		}
	} else {
		if (!$options['link_type']) {
			array_push($buttons, "separator", "contextlylink");
		}
	}

	array_push($buttons, "separator", "contextly");
	return $buttons;
}

// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function add_contextly_tinymce_plugin($plugin_array) {
	$plugin_array['contextlylink'] = plugins_url('js/contextly_linker_wplink.js' , __FILE__ );
	$plugin_array['contextly'] = plugins_url('js/contextly_linker_button.js' , __FILE__ );
	return $plugin_array;
}

// Init process for button control
add_action('init', 'contextly_addbuttons');

// Main contextly class
if (!class_exists("ContextlyActivate")) {
	class ContextlyActivate {
		var $server_url= "https://contextly.com/";
		var $general_settings_key = 'contextly_options_general';
		var $advanced_settings_key = 'contextly_options_advanced';
		var $plugin_options_key = 'contextly_options';
		var $plugin_settings_tabs = array();

		function ContextlyActivate() {
			$this->general_settings = (array) get_option($this->general_settings_key);
			$this->advanced_settings = (array) get_option($this->advanced_settings_key);

			// Merge with defaults
			$this->general_settings = array_merge( array(
			        'link_type_override' => 'Override',
					'link_type_default' => 'Default'
			), $this->general_settings );

			$this->advanced_settings = array_merge( array(
			        'linker_target_id' => 'CSS ID',
			        'linker_block_position' => 'Position'
			), $this->advanced_settings );
		}

		function init() {}

		function addSettngsMenu() {
			add_options_page('Contextly Linker', 'Contextly Linker', 'manage_options', $this->plugin_options_key, array(&$this, 'showSettings'));
			add_filter('plugin_action_links', array(&$this, 'addSettingsLink'), 10, 2);
		}

		function initSettings() {
			// Register settings
			register_setting($this->general_settings_key, $this->general_settings_key, array(&$this, 'settingsValidate'));
			$this->plugin_settings_tabs[$this->general_settings_key] = 'General';

			register_setting($this->advanced_settings_key, $this->advanced_settings_key, array(&$this, 'settingsValidate'));

			add_settings_section('main_section', 'Single Link Button', array(&$this, 'settingsMainSection'), $this->advanced_settings_key);
			add_settings_field('link_type_override', 'Override', array(&$this, 'settingsOverride'), $this->advanced_settings_key, 'main_section');
			add_settings_field('link_type_default', 'Default', array(&$this, 'settingsDefault'), $this->advanced_settings_key, 'main_section');

			add_settings_section('advanced_section', 'Layout Settings', array(&$this, 'settingsLayoutSection'), $this->advanced_settings_key);
			add_settings_field('linker_target_id', 'CSS Element ID', array(&$this, 'settingsTargetInput'), $this->advanced_settings_key, 'advanced_section');
			add_settings_field('linker_block_position', 'Position', array(&$this, 'settingsBlockPosition'), $this->advanced_settings_key, 'advanced_section');
			$this->plugin_settings_tabs[$this->advanced_settings_key] = 'Advanced';
		}

		function settingsValidate($input) {
			return $input;
		}

		function settingsMainSection() {}

		function settingsLayoutSection() {
			echo "<p>
					By default, Contextly is set to show up as the very last object in your post template. For most sites, this is perfect. However, if you have other plugins that come after the body of the text, you can adjust where Contextly displays using this setting.
				 </p>
				 <p>
				 	To set the placement of Contextly related links relative to other elements, simply provide the other item's CSS element ID, and whether you prefer to be above or below that element.
				 </p>";
		}

		function settingsOverride() {
			$options = get_option($this->advanced_settings_key);
			echo "<label>";
			echo "<input id='link_type_override' name='{$this->advanced_settings_key}[link_type]' type='radio' value='override' " . ($options['link_type'] == "override" ? "checked='checked'" : "") . "/>";
			echo " With this setting, the Wordpress link button in the Visual editor is changed to used Contextly to add links to the body of your posts. There is no dedicated button for adding single links through Contextly with this option.";
			echo "</label>";
		}

		function settingsDefault() {
			$options = get_option($this->advanced_settings_key);
			echo "<label>";
			echo "<input id='link_type_default' name='{$this->advanced_settings_key}[link_type]' type='radio' value='' " . (!$options['link_type'] ? "checked='checked'" : "") . "/>";
			echo " With this setting, Wordpress's single link button in the Visual editor works as it normally does. The Visual editor bar gets an additional single link button so you can add links to the body of your post using Contextly.";
			echo "</label>";
		}

		function settingsTargetInput() {
			$options = get_option($this->advanced_settings_key);
			echo "<input id='linker_target_id' name='{$this->advanced_settings_key}[target_id]' type='text' size='30' value='{$options["target_id"]}' />";
		}

		function settingsBlockPosition() {
			$options = get_option($this->advanced_settings_key);
			echo "
				<select id='linker_block_position' name='{$this->advanced_settings_key}[block_position]'>
					<option value='after' " . ($options["block_position"] == "after" ? "selected='selected'" : "") . ">Below</option>
					<option value='before' " . ($options["block_position"] == "before" ? "selected='selected'" : "") . ">Above</option>
				</select>
			";
		}

		function showSettings()	{
			$tab = isset( $_GET['tab'] ) ? $_GET['tab'] : $this->general_settings_key;
			?>
			<script type="text/javascript">
				function open_contextly_settings() {
					window.open("<? echo $this->server_url ?>redirect.php?type=settings&blog_url=<?php echo site_url(); ?>");
				}
			</script>
			<div class="wrap">
				<?php $this->showSettingsTabs(); ?>

				<? if ($tab == $this->advanced_settings_key) { ?>
					<form action="options.php" method="post">
						<?php settings_fields($tab); ?>
						<?php do_settings_sections($tab); ?>
						<?php submit_button(); ?>
					</form>
				<? } else { ?>
					<h3>
						The majority of  the settings for Contextly are handled outside Wordpress. Press the settings button to go to your settings panel. You will need your Twitter credentials to login.
					</h3>
					<p>
						<input type="button" value="Settings" onclick="open_contextly_settings();" style="font-size: 18px; padding: 5px;" />
					</p>
				<? } ?>
			</div>
			<?
		}

		function showSettingsTabs() {
			$current_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : $this->general_settings_key;

			screen_icon();
			echo '<h2 class="nav-tab-wrapper">';
			foreach ( $this->plugin_settings_tabs as $tab_key => $tab_caption ) {
				$active = $current_tab == $tab_key ? 'nav-tab-active' : '';
				echo '<a class="nav-tab ' . $active . '" href="?page=' . $this->plugin_options_key . '&tab=' . $tab_key . '">' . $tab_caption . '</a>';
			}
			echo '</h2>';
		}

		// Cut only needed data from post object
		function getPostToSend($post) {
			$post_data = array();
			$post_data["ID"] = $post->ID;
			$post_data["post_title"] = $post->post_title;
			$post_data["post_date"] = $post->post_date;
			$post_data["post_status"] = $post->post_status;
			return $post_data;
		}

		// Return only 3 first tags from post
		function getPostTagsToSend($post) {
			$post_tags = get_the_tags($post->ID);
			$tags = array();
			if (is_array($post_tags) && count($post_tags) > 0) {
				foreach (array_slice($post_tags, 0, 3) as $post_tag) {
					if ($post_tag->name) $tags[] = array("name" => $post_tag->name);
				}
			}
			return $tags;
		}

		function get_options() {
			$advanced_option = get_option($this->advanced_settings_key);
			if (!is_array($advanced_option)) $advanced_option = array();

			return $advanced_option;
		}

		// Add main js stuff for contextly api calls
		function buildJsData($admin_mode = false) {
			global $post;
			?>
			<script type="text/javascript">
			    var contextly_post_object = {
						post: <?php echo json_encode($this->getPostToSend($post)); ?>,
						post_tags: <?php echo json_encode($this->getPostTagsToSend($post)); ?>,
						blog_url: "<?php echo site_url(); ?>",
						blog_title: "<?php echo get_bloginfo("name"); ?>",
						page_permalink: "<?php echo get_permalink($post->ID); ?>",
						author: <?php echo json_encode(array("id" => $post->post_author, "firstname" => get_the_author_meta("first_name", $post->post_author), "lastname" => get_the_author_meta("last_name", $post->post_author))) ?>,
						admin: <?php echo (int)$admin_mode; ?>
			    };

				var contextly_settings = <?php echo json_encode($this->get_options()); ?>;

			    (function() {
					var src = document.createElement('script');
					src.async = true;
					src.src = "<?php echo contextly_get_plugin_url(); ?>";
					if (contextly_post_object.admin) {
						if (src.readyState) { // IE
				    	} else { //Others
				        	src.onerror = function () {
					        	jQuery("#linker_widget").html("Error loading data from <a target='_blank' href='http://contextly.com'>contextly.com</a>. Please <a target='_blank' href='http://contextly.com'>contact us</a> so we can help resolve the problem.");
				        	};
				    	}
				    }
					document.getElementsByTagName('head')[0].appendChild(src);
				}());
			</script>
			<?php
		}

		// Admin header
		function adminHead() {
			global $pagenow;

			// Check if this is admin edit page action
			if ($pagenow == "post.php" || $pagenow == "post-new.php") {
				?>
				<script type="text/javascript" src="//contextlysitescripts.contextly.com/js/easyXDM.min.js"></script>
				<script type="text/javascript" src="//contextlysitescripts.contextly.com/js/jquery.xdomainajax.js"></script>
				<?php echo $this->buildJsData(true); ?>
				<?php
			}
		}

		// Normal page header
		function head() {
			if (is_single()) {
				$this->buildJsData();
			}
		}

		// Add settings link on plugins page
		function addSettingsLink($links, $file) {
			if ($file == plugin_basename(__FILE__))
			$links[] = "<a href='admin.php?page=contextly_options'>" . __('Settings') . "</a>";
			return $links;
		}

		// Publish post action
		function publishPostAction($post_ID, $post) {
			if ($post->post_status == "publish" && $post->post_type == "post") {
				// Find api url on contextly server
				$url_parts = parse_url($this->server_url);
				$api_url = "http://{$url_parts["host"]}/sites/api2.php";

				// Make call for save post details in contextly
				$response = wp_remote_retrieve_body(
					wp_remote_post(
						$api_url,
						array(
							'method' => 'POST',
							'body' => array(
					        	"method" => "publish-post",
					        	"post" => get_post($post, ARRAY_A),
								"post_tags" =>  $this->getPostTagsToSend($post),
								"blog_url" => site_url(),
								"author" => array("firstname" => get_the_author_meta("first_name", $post->post_author), "lastname" => get_the_author_meta("last_name", $post->post_author)),
								"page_permalink" => get_permalink($post_ID),
								"page_thumbnail" => $this->getPostImages($post_ID)
							)
						)
					)
				);
			}
		}

		// Get post possible images
		function getPostImages($post_ID) {
			$post_images = array();

			// Try to get attached images
			$attachment_images = get_children(
				array(
					'post_parent' => $post_ID,
					'post_type' => 'attachment',
					'numberposts' => 0,
					'post_mime_type' => 'image'
				)
			);
			if ($attachment_images && is_array($attachment_images)) {
				foreach($attachment_images as $image) {
					list($src, $width, $height) = wp_get_attachment_image_src($image->ID, 'full');
					array_push($post_images, $src);
				}
			}

			return $post_images;
		}

	}
}

if (class_exists("ContextlyActivate")) {
	$ctxActivate = new ContextlyActivate();
}

if (isset($ctxActivate)) {
	add_action('admin_menu', array(&$ctxActivate,'addSettngsMenu'));
	add_action('admin_head', array(&$ctxActivate,'adminHead'), 1);
	add_action('wp_head', array(&$ctxActivate, 'head'), 1);
	add_action('publish_post', array(&$ctxActivate, 'publishPostAction'), 10, 2);
	add_action('admin_init', 'contextly_add_see_also_meta_box', 1);
}
?>
