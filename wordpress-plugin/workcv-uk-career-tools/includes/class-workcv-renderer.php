<?php

if (!defined('ABSPATH')) {
    exit;
}

class WorkCV_UK_Tools_Renderer {
    private $settings;

    private $tools = array(
        'take-home-pay' => array(
            'title' => 'UK take-home pay calculator',
            'path' => 'take-home-pay-calculator',
            'height' => 1180,
        ),
        'living-wage' => array(
            'title' => 'UK Living Wage checker',
            'path' => 'living-wage-checker',
            'height' => 880,
        ),
        'redundancy-pay' => array(
            'title' => 'UK redundancy pay calculator',
            'path' => 'redundancy-pay-calculator',
            'height' => 1080,
        ),
    );

    public function __construct($settings) {
        $this->settings = $settings;
    }

    public function render($tool, $attributes = array()) {
        if (!isset($this->tools[$tool])) {
            return '';
        }

        $config = $this->tools[$tool];
        $theme = $this->value($attributes, 'theme', $this->settings->get('theme'));
        $cta = $this->toggle($attributes, 'cta', $this->settings->get('cta'));
        $footer = $this->toggle($attributes, 'footer', $this->settings->get('footer'));

        $src = add_query_arg(
            array(
                'source' => 'wordpress',
                'tool' => $tool,
                'theme' => 'paper' === $theme ? 'paper' : 'light',
                'cta' => $cta ? 'on' : 'off',
                'footer' => $footer ? 'on' : 'off',
            ),
            'https://workcv.co.uk/embed/' . $config['path']
        );

        wp_enqueue_style('workcv-uk-tools');
        wp_enqueue_script('workcv-uk-tools');

        return sprintf(
            '<div class="workcv-tool-embed"><iframe class="workcv-tool-iframe" src="%1$s" title="%2$s" loading="lazy" height="%3$d" data-workcv-embed></iframe><noscript><p>%4$s</p></noscript></div>',
            esc_url($src),
            esc_attr($config['title']),
            absint($config['height']),
            esc_html__('JavaScript is required to use this calculator.', 'workcv-uk-career-tools')
        );
    }

    private function value($attributes, $key, $fallback) {
        return isset($attributes[$key]) && '' !== $attributes[$key] ? sanitize_key($attributes[$key]) : $fallback;
    }

    private function toggle($attributes, $key, $fallback) {
        if (!isset($attributes[$key]) || '' === $attributes[$key]) {
            return '1' === $fallback;
        }

        if (is_bool($attributes[$key])) {
            return $attributes[$key];
        }

        return in_array(strtolower((string) $attributes[$key]), array('1', 'true', 'yes', 'on'), true);
    }
}
