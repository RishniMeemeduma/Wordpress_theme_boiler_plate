<?php
// head cleanup
remove_action('wp_head', 'feed_links_extra');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'parent_post_rel_link');
remove_action('wp_head', 'start_post_rel_link');
remove_action('wp_head', 'adjacent_posts_rel_link');
remove_action('wp_head', 'noindex');

add_action('after_setup_theme', 'boilerplate_domain_to_change_translate');
function boilerplate_domain_to_change_translate(){
	load_theme_textdomain('boilerplate_domain_to_change', get_template_directory() . '/languages');
}

add_action('after_setup_theme', 'boilerplate_domain_to_change_theme_features');
function boilerplate_domain_to_change_theme_features(){
	// Add support for basic WordPress features
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' ); // Let WordPress manage the <title> tag
	add_theme_support( 'html5', array('caption', 'comment-form', 'comment-list', 'gallery', 'search-form') );
}

add_action('wp_head', 'boilerplate_domain_to_change_head', 0);
function boilerplate_domain_to_change_head(){ 
?>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
}

add_action('wp_enqueue_scripts', 'boilerplate_domain_to_change_print_assets');
function boilerplate_domain_to_change_print_assets(){
	// To use this, define the THEME_ASSETS_VERSION constant in the wp-config.php (or wherever you want)
	$ver = defined('THEME_ASSETS_VERSION') ? THEME_ASSETS_VERSION : false;

	if( (defined('CSS_DEBUG') && !CSS_DEBUG && file_exists(dirname(__FILE__).'/build/cssbuild.php')) ) {
		// stylesheets (minified version)
		require(dirname(__FILE__).'/build/cssbuild.php');
		wp_enqueue_style('boilerplate_domain_to_change-cssbuild', get_stylesheet_directory_uri().'/css/'.CSSBUILD.'.css', array(), null);
	} else {
		// stylesheets (follow SMACSS guidelines)
		wp_enqueue_style('boilerplate_domain_to_change-base', get_stylesheet_directory_uri().'/css/base.css', array(), $ver);
		wp_enqueue_style('boilerplate_domain_to_change-layout', get_stylesheet_directory_uri().'/css/layout.css', array('boilerplate_domain_to_change-base'), $ver);
		wp_enqueue_style('boilerplate_domain_to_change-module', get_stylesheet_directory_uri().'/css/module.css', array('boilerplate_domain_to_change-layout'), $ver);
		wp_enqueue_style('boilerplate_domain_to_change-state', get_stylesheet_directory_uri().'/css/state.css', array('boilerplate_domain_to_change-module'), $ver);
		wp_enqueue_style('boilerplate_domain_to_change-theme', get_stylesheet_directory_uri().'/css/theme.css', array('boilerplate_domain_to_change-state'), $ver);
	}

	wp_enqueue_script('modernizr', get_template_directory_uri().'/js/libs/modernizr-2.6.2.min.js', array(), '2.6.2', false);

	if(defined('SCRIPT_DEBUG') && !SCRIPT_DEBUG && file_exists(dirname(__FILE__).'/build/jsbuild.php')){
		// scripts (minified version)
		require(dirname(__FILE__).'/build/jsbuild.php');
		wp_enqueue_script('boilerplate_domain_to_change-jsbuild', get_stylesheet_directory_uri().'/js/'.JSBUILD.'.min.js', array('jquery'), null, true);
	} else {
		wp_enqueue_script('boilerplate_domain_to_change-plugins', get_template_directory_uri().'/js/plugins.js', array('jquery'), $ver, true);
		wp_enqueue_script('boilerplate_domain_to_change-main', get_template_directory_uri().'/js/main.js', array('jquery', 'boilerplate_domain_to_change-plugins'), $ver, true);
	}
}

// include features from inc/ directroy
foreach( array( ) as $feature ) {
	$file = sprintf( '%s/inc/%s.php', get_template_directory(), $feature );
	$rep = sprintf( '%s/inc/%s/register.php', get_template_directory(), $feature );
	if( file_exists( $file ) ) {
		require_once( $file );
	} else if( file_exists( $rep ) ) {
		require_once( $rep );
	}
}

