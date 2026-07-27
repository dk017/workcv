(function (blocks, element, components, blockEditor, i18n) {
  "use strict";

  var el = element.createElement;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var __ = i18n.__;

  var tools = [
    ["take-home-pay", "UK Take-Home Pay Calculator"],
    ["living-wage", "UK Living Wage Checker"],
    ["redundancy-pay", "UK Redundancy Pay Calculator"]
  ];

  tools.forEach(function (tool) {
    blocks.registerBlockType("workcv/" + tool[0], {
      apiVersion: 3,
      title: "WorkCV: " + tool[1],
      icon: "calculator",
      category: "widgets",
      attributes: {
        theme: { type: "string", default: "" },
        cta: { type: "boolean" },
        footer: { type: "boolean" }
      },
      edit: function (props) {
        var attrs = props.attributes;
        return el(
          element.Fragment,
          null,
          el(
            InspectorControls,
            null,
            el(
              PanelBody,
              { title: __("WorkCV embed settings", "workcv-uk-career-tools"), initialOpen: true },
              el(SelectControl, {
                label: __("Theme", "workcv-uk-career-tools"),
                value: attrs.theme || "",
                options: [
                  { label: __("Use plugin default", "workcv-uk-career-tools"), value: "" },
                  { label: __("White", "workcv-uk-career-tools"), value: "light" },
                  { label: __("Warm paper", "workcv-uk-career-tools"), value: "paper" }
                ],
                onChange: function (value) { props.setAttributes({ theme: value }); }
              }),
              el(ToggleControl, {
                label: __("Show WorkCV call to action", "workcv-uk-career-tools"),
                checked: Boolean(attrs.cta),
                onChange: function (value) { props.setAttributes({ cta: value }); }
              }),
              el(ToggleControl, {
                label: __("Show WorkCV credit link", "workcv-uk-career-tools"),
                checked: Boolean(attrs.footer),
                onChange: function (value) { props.setAttributes({ footer: value }); }
              })
            )
          ),
          el(
            "div",
            {
              className: "components-placeholder",
              style: { border: "1px solid #a7aaad", padding: "24px", background: "#fff" }
            },
            el("strong", null, "WorkCV: " + tool[1]),
            el("p", null, __("The maintained calculator will appear here on the published page.", "workcv-uk-career-tools"))
          )
        );
      },
      save: function () { return null; }
    });
  });
})(window.wp.blocks, window.wp.element, window.wp.components, window.wp.blockEditor, window.wp.i18n);
