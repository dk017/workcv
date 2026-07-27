(function () {
  "use strict";

  var messageType = "WORKCV_EMBED_HEIGHT";
  var allowedOrigin = "https://workcv.co.uk";

  window.addEventListener("message", function (event) {
    if (event.origin !== allowedOrigin || !event.data || event.data.type !== messageType) {
      return;
    }

    var height = Number(event.data.height);
    if (!Number.isFinite(height) || height < 320 || height > 5000) {
      return;
    }

    document.querySelectorAll("iframe[data-workcv-embed]").forEach(function (iframe) {
      if (iframe.contentWindow === event.source) {
        iframe.style.height = Math.ceil(height) + "px";
      }
    });
  });
})();
