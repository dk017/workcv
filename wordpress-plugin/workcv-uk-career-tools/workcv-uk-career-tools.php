<?php
/**
 * Plugin Name: WorkCV UK Career Tools
 * Plugin URI: https://workcv.co.uk/wordpress/uk-career-tools-plugin
 * Description: Add maintained UK pay and employment calculators with Gutenberg blocks and shortcodes.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * Author: WorkCV
 * Author URI: https://workcv.co.uk
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: workcv-uk-career-tools
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WORKCV_UK_TOOLS_VERSION', '0.1.0');
define('WORKCV_UK_TOOLS_FILE', __FILE__);
define('WORKCV_UK_TOOLS_DIR', plugin_dir_path(__FILE__));
define('WORKCV_UK_TOOLS_URL', plugin_dir_url(__FILE__));

require_once WORKCV_UK_TOOLS_DIR . 'includes/class-workcv-settings.php';
require_once WORKCV_UK_TOOLS_DIR . 'includes/class-workcv-renderer.php';
require_once WORKCV_UK_TOOLS_DIR . 'includes/class-workcv-plugin.php';

add_action('plugins_loaded', array('WorkCV_UK_Tools_Plugin', 'boot'));
