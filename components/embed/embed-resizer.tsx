"use client";

import { useEffect } from "react";

const MESSAGE_TYPE = "WORKCV_EMBED_HEIGHT";

export function EmbedResizer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".workcv-embed-root");
    if (!root || window.parent === window) return;

    let frame = 0;
    const publishHeight = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        window.parent.postMessage(
          {
            type: MESSAGE_TYPE,
            height: Math.ceil(root.getBoundingClientRect().height),
          },
          "*",
        );
      });
    };

    const observer = new ResizeObserver(publishHeight);
    observer.observe(root);
    publishHeight();
    window.addEventListener("load", publishHeight);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("load", publishHeight);
    };
  }, []);

  return null;
}
