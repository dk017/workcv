=== WorkCV UK Career Tools ===
Contributors: rdhinesh17
Tags: salary calculator, take home pay, living wage, redundancy pay, uk
Requires at least: 6.4
Tested up to: 6.9
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add maintained UK pay and employment calculators to WordPress with Gutenberg blocks and shortcodes.

== Description ==

WorkCV UK Career Tools helps career, HR, recruitment, education and employee-support sites publish useful calculators without maintaining tax thresholds or employment limits in WordPress.

Included:

* UK take-home pay calculator
* UK Living Wage checker
* UK redundancy pay calculator

The tools use hosted embeds from WorkCV.co.uk. No WorkCV account is required.

Privacy and link policy:

* calculations run in the embedded browser interface
* no visitor account is required
* no public backlink is added automatically
* optional WorkCV call-to-action and credit links are disabled by default

== Installation ==

1. Upload and activate the plugin.
2. Add a WorkCV block in the block editor, or use a shortcode.
3. Change optional defaults under Settings -> WorkCV Tools.

Shortcodes:

* `[workcv_take_home_pay]`
* `[workcv_living_wage]`
* `[workcv_redundancy_pay]`

Optional attributes:

* `theme="light"` or `theme="paper"`
* `cta="on"` or `cta="off"`
* `footer="on"` or `footer="off"`

== External services ==

This plugin connects to WorkCV.co.uk whenever a page containing a WorkCV tool is viewed. The connection is required to load and maintain the hosted calculator interface.

The web request sends standard connection data such as the visitor's IP address, browser user agent, referring page and request time to WorkCV's hosting infrastructure. Calculator inputs are processed in the embedded browser interface and are not submitted to a WorkCV account.

Service provider: WorkCV

* Plugin privacy details: https://workcv.co.uk/wordpress/uk-career-tools-plugin/privacy
* WorkCV privacy policy: https://workcv.co.uk/privacy
* WorkCV terms: https://workcv.co.uk/terms

== Frequently Asked Questions ==

= Does the plugin add a backlink automatically? =

No. Both the WorkCV call to action and credit link are opt-in.

= Do I need to update tax calculations in WordPress? =

No. WorkCV maintains the hosted tools. Publishers should still review their page copy when a new tax year or statutory limit takes effect.

= Does it require an account or API key? =

No.

= Where are support and privacy details? =

Support: https://workcv.co.uk/wordpress/uk-career-tools-plugin

Privacy: https://workcv.co.uk/wordpress/uk-career-tools-plugin/privacy

== Changelog ==

= 0.1.0 =

Initial release with three hosted UK tools, Gutenberg blocks, shortcodes and responsive iframe resizing.
