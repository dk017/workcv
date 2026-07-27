<?php

if (!defined('ABSPATH')) {
    exit;
}

class WorkCV_UK_Tools_Plugin {
    private static $instance;
    private $settings;
    private $renderer;

    public static function boot() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->settings = new WorkCV_UK_Tools_Settings();
        $this->renderer = new WorkCV_UK_Tools_Renderer($this->settings);

        add_action('init', array($this, 'register_assets'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('init', array($this, 'register_blocks'));
        add_action('admin_init', array($this->settings, 'register'));
        add_action('admin_menu', array($this, 'admin_menu'));
    }

    public function register_assets() {
        wp_register_style(
            'workcv-uk-tools',
            WORKCV_UK_TOOLS_URL . 'assets/embed.css',
            array(),
            WORKCV_UK_TOOLS_VERSION
        );
        wp_register_script(
            'workcv-uk-tools',
            WORKCV_UK_TOOLS_URL . 'assets/embed.js',
            array(),
            WORKCV_UK_TOOLS_VERSION,
            true
        );
        wp_register_script(
            'workcv-uk-tools-blocks',
            WORKCV_UK_TOOLS_URL . 'assets/blocks.js',
            array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n'),
            WORKCV_UK_TOOLS_VERSION,
            true
        );
    }

    public function register_shortcodes() {
        $map = array(
            'workcv_take_home_pay' => 'take-home-pay',
            'workcv_living_wage' => 'living-wage',
            'workcv_redundancy_pay' => 'redundancy-pay',
        );

        foreach ($map as $shortcode => $tool) {
            add_shortcode($shortcode, function ($atts) use ($tool) {
                return $this->renderer->render(
                    $tool,
                    shortcode_atts(array('theme' => '', 'cta' => '', 'footer' => ''), $atts)
                );
            });
        }
    }

    public function register_blocks() {
        $map = array(
            'take-home-pay' => 'take-home-pay',
            'living-wage' => 'living-wage',
            'redundancy-pay' => 'redundancy-pay',
        );

        foreach ($map as $block => $tool) {
            register_block_type(
                'workcv/' . $block,
                array(
                    'api_version' => 3,
                    'editor_script' => 'workcv-uk-tools-blocks',
                    'attributes' => array(
                        'theme' => array('type' => 'string', 'default' => ''),
                        'cta' => array('type' => 'boolean'),
                        'footer' => array('type' => 'boolean'),
                    ),
                    'render_callback' => function ($attributes) use ($tool) {
                        return $this->renderer->render($tool, $attributes);
                    },
                )
            );
        }
    }

    public function admin_menu() {
        add_options_page(
            __('WorkCV UK Career Tools', 'workcv-uk-career-tools'),
            __('WorkCV Tools', 'workcv-uk-career-tools'),
            'manage_options',
            'workcv-uk-career-tools',
            array($this, 'settings_page')
        );
    }

    public function settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('WorkCV UK Career Tools', 'workcv-uk-career-tools'); ?></h1>
            <p><?php esc_html_e('Hosted calculations stay current on WorkCV. Your pages keep the block or shortcode in place.', 'workcv-uk-career-tools'); ?></p>
            <form action="options.php" method="post">
                <?php
                settings_fields('workcv_uk_tools');
                do_settings_sections('workcv-uk-career-tools');
                submit_button();
                ?>
            </form>
            <hr>
            <h2><?php esc_html_e('Shortcodes', 'workcv-uk-career-tools'); ?></h2>
            <p><code>[workcv_take_home_pay]</code></p>
            <p><code>[workcv_living_wage]</code></p>
            <p><code>[workcv_redundancy_pay]</code></p>
        </div>
        <?php
    }
}
