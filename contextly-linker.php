<?php
/**
 * @package Contextly_Linker
 * @version 1.0.60
 */
/*
Plugin Name: Contextly Linker
Plugin URI: http://contextly.com
Description: Adds the Contextly related links tool to your blog. Contextly lets you create related links that helps your readers find more to read, increases your page views and shows off your best content.
Author: Contextly
Version: 1.0.60
*/

function contextly_get_plugin_url() {
	return "http://contextlysitescripts.contextly.com/plugin/linker-plugin.js?version=1.0.60";
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
}
add_action('admin_init', 'contextly_add_see_also_meta_box', 1);

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
	$contextly = new ContextlyActivate();
	$settings = $contextly->readSettings();

	// Now we need to add contextly link btn at position of native link button
	if (is_array($buttons) && count($buttons) > 0) {
		foreach ($buttons as $btn_idx => $button) {
			if ($button == "link") {
				if ($settings['link_type'] == "override") {
					$buttons[$btn_idx] = "contextlylink";
				} else {
					array_splice($buttons, $btn_idx, 0, "contextlylink");
				}
			}
		}
	} else {
		if (!$settings['link_type']) {
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
		var $ctxVar ="ContextlySettings";
		var $serverUrl = "https://contextly.com/";

		function ContextlyActivate() {
		}

		function init() {
			$this->readSettings();
		}

		function readSettings() {
			$ctxOptions = array(
					'link_type' => "",
			);
			$opts = get_option($this->ctxVar);
			if(!empty($opts)) {
				foreach($opts as $var => $val) {
					$ctxOptions[$var] = $val;
				}
			}
			update_option($this->ctxVar, $ctxOptions);
			return $ctxOptions;
		}

		function showSettings()	{
         	$opts = $this->readSettings();
         	if (isset($_POST['submit'])) {
            	if(isset($_POST['link_type'])) {
               		$opts['link_type'] = $_POST['link_type'];
            	}
            	update_option($this->ctxVar, $opts);
               echo '<div class="updated"><p><strong>';
               _e("Your changes were saved.");
               echo '</strong></p></div>';
         	}
			?>
			<div class="wrap">
				<div class="icon32" id="icon-options-general"><br></div><h2>Contextly Linker Settings</h2>

				<p>
					The majority of Contextly's settings, including the display options, are set on the Contextly web site.
					To navigate to them, open any post, click one of the "Create See Also" buttons. Then look for the "Settings" link on the top of the page.
				</p>


				<form method="post" action="<?php echo $_SERVER["REQUEST_URI"]; ?>" name="form">
					<table class="form-table">
						<tbody>
							<tr>
								<th>
									<label>
										<input type="radio" class="tog" value="override" name="link_type" <?php echo ($opts['link_type'] == "override" ? "checked='checked'" : "") ?>> Override
									</label>
								</th>
								<td>
									With this setting, the Wordpress link button in the Visual editor is changed to used Contextly to add links to the body of your posts. There is no dedicated button for adding single links through Contextly with this option.
								</td>
							</tr>
							<tr>
								<th>
									<label>
										<input type="radio" class="tog" value="" name="link_type" <?php echo (!$opts['link_type'] ? "checked='checked'" : "") ?>> Dedicated
									</label>
								</th>
								<td>
									With this setting, Wordpress's single link button in the Visual editor works as it normally does. The Visual editor bar gets an additional single link button so you can add links to the body of your post using Contextly.
								</td>
							</tr>
						</tbody>
					</table>

					<p class="submit">
						<input type="submit" value="Save Changes" class="button-primary" id="submit" name="submit">
					</p>
				</form>
			</div>
			<?php
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
						admin: <?php echo (int)$admin_mode; ?>
			    };

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
			static $this_plugin;
			if (!$this_plugin) $this_plugin = plugin_basename(__FILE__);

			if ($file == $this_plugin){
				$settings_link = '<a title="Contextly Linker settings" href="admin.php?page=contextly-linker.php">'.__("Settings").'</a>';
				$links[] = $settings_link;
			}
			return $links;
		}

		// Publish post action
		function publishPostAction($post_ID, $post) {
			// Find api url on contextly server
			$url_parts = parse_url($this->serverUrl);
			$api_url = "http://{$url_parts["host"]}/sites/api2.php";

			$params = array(
				'http' => array(
				    	'method' => 'POST',
				        'content' => http_build_query(
							array(
					        	"method" => "publish-post",
					        	"post" => get_post($post, ARRAY_A),
								"post_tags" =>  $this->getPostTagsToSend($post),
								"blog_url" => site_url(),
								"author" => array("firstname" => get_the_author_meta("first_name", $post->post_author), "lastname" => get_the_author_meta("last_name", $post->post_author)),
								"page_permalink" => get_permalink($post_ID),
							)
						)
				)
			);

			$ctx = stream_context_create($params);
			$fp = @fopen($api_url, 'rb', false, $ctx);
			if (!$fp) return false;
			$response = @stream_get_contents($fp);
			if ($response !== false) return true;
		}


	}
}

if (!function_exists("ContextlyBtnSetting")) {
	function ContextlyBtnSetting() {
		global $ctxActivate;
		if (!isset($ctxActivate)) return;
		if (function_exists("add_options_page")) {
			add_options_page('Contextly Linker', 'Contextly Linker', 'activate_plugins', basename(__FILE__), array(&$ctxActivate, 'showSettings'));
		}
	}
}

if (class_exists("ContextlyActivate")) {
	$ctxActivate = new ContextlyActivate();
}

if (isset($ctxActivate)) {
	add_action('admin_menu', 'ContextlyBtnSetting');
	add_action('admin_head', array(&$ctxActivate,'adminHead'), 1);
	add_action('wp_head', array(&$ctxActivate, 'head'), 1);
	add_action('activate_contextly-linker/contextly-linker.php', array(&$ctxActivate, 'init'));
	add_filter('plugin_action_links', array(&$ctxActivate, 'addSettingsLink'), 10, 2 );
	add_action('publish_post', array(&$ctxActivate, 'publishPostAction'), 10, 2);
	add_action('save_post', array(&$ctxActivate, 'publishPostAction'), 10, 2);
}


?>
