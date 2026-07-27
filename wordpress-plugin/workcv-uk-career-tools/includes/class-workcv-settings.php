<?php

if (!defined('ABSPATH')) {
    exit;
}

class WorkCV_UK_Tools_Settings {
    const OPTION = 'workcv_uk_tools_settings';

    public static function defaults() {
        return array(
            'theme' => 'light',
            'cta' => '0',
            'footer' => '0',
        );
    }

    public function register() {
        register_setting(
            'workcv_uk_tools',
            self::OPTION,
            array(
                'type' => 'array',
                'sanitize_callback' => array($this, 'sanitize'),
                'default' => self::defaults(),
            )
        );

        add_settings_section(
            'workcv_uk_tools_general',
            __('Embed defaults', 'workcv-uk-career-tools'),
            array($this, 'section_intro'),
            'workcv-uk-career-tools'
        );

        add_settings_field('theme', __('Theme', 'workcv-uk-career-tools'), array($this, 'theme_field'), 'workcv-uk-career-tools', 'workcv_uk_tools_general');
        add_settings_field('cta', __('WorkCV call to action', 'workcv-uk-career-tools'), array($this, 'cta_field'), 'workcv-uk-career-tools', 'workcv_uk_tools_general');
        add_settings_field('footer', __('WorkCV credit link', 'workcv-uk-career-tools'), array($this, 'footer_field'), 'workcv-uk-career-tools', 'workcv_uk_tools_general');
    }

    public function get($key) {
        $settings = wp_parse_args(get_option(self::OPTION, array()), self::defaults());
        return isset($settings[$key]) ? $settings[$key] : null;
    }

    public function sanitize($input) {
        $input = is_array($input) ? $input : array();
        return array(
            'theme' => isset($input['theme']) && 'paper' === $input['theme'] ? 'paper' : 'light',
            'cta' => empty($input['cta']) ? '0' : '1',
            'footer' => empty($input['footer']) ? '0' : '1',
        );
    }

    public function section_intro() {
        echo '<p>' . esc_html__('Choose the default appearance for new WorkCV tool embeds. Public links are optional and off by default.', 'workcv-uk-career-tools') . '</p>';
    }

    public function theme_field() {
        $value = $this->get('theme');
        echo '<select name="' . esc_attr(self::OPTION) . '[theme]">';
        echo '<option value="light" ' . selected($value, 'light', false) . '>' . esc_html__('White', 'workcv-uk-career-tools') . '</option>';
        echo '<option value="paper" ' . selected($value, 'paper', false) . '>' . esc_html__('Warm paper', 'workcv-uk-career-tools') . '</option>';
        echo '</select>';
    }

    public function cta_field() {
        $this->checkbox('cta', __('Show an optional “Open full tool” link.', 'workcv-uk-career-tools'));
    }

    public function footer_field() {
        $this->checkbox('footer', __('Show an optional “Powered by WorkCV” credit link.', 'workcv-uk-career-tools'));
    }

    private function checkbox($key, $label) {
        printf(
            '<label><input type="checkbox" name="%1$s[%2$s]" value="1" %3$s> %4$s</label>',
            esc_attr(self::OPTION),
            esc_attr($key),
            checked($this->get($key), '1', false),
            esc_html($label)
        );
    }
}
