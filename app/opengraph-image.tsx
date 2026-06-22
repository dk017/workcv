import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `WorkCV - One UK CV. ${site.priceGbp}. Nothing to cancel.`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#0f2942",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -130,
            top: -130,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "#f5e6c0",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 22,
            background: "#0f2942",
          }}
        />
        <div
          style={{
            width: "58%",
            padding: "70px 0 70px 76px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{site.name}</div>
            <div
              style={{
                fontSize: 84,
                lineHeight: 0.94,
                fontWeight: 900,
              }}
            >
              Stop paying monthly for one CV.
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.2, color: "#1a1a1a" }}>
              Build first. Pay {site.price} when the PDF is ready.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            <div
              style={{
                background: "#0f2942",
                color: "#ffffff",
                borderRadius: 12,
                padding: "16px 24px",
              }}
            >
              No subscription
            </div>
            <div style={{ color: "#1a1a1a" }}>No renewal. Nothing to cancel.</div>
          </div>
        </div>
        <div
          style={{
            width: "42%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 360,
              height: 470,
              background: "#ffffff",
              border: "4px solid #0f2942",
              boxShadow: "0 24px 70px rgba(15, 41, 66, 0.22)",
              borderRadius: 18,
              padding: 34,
              transform: "rotate(3deg)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ height: 12, width: 112, background: "#d4a843" }} />
            <div style={{ fontSize: 34, fontWeight: 900 }}>Your Name</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
              Customer Service Assistant
            </div>
            {["Profile", "Experience", "Skills"].map((label, index) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#0f2942" }}>
                  {label}
                </div>
                <div
                  style={{
                    height: 9,
                    width: `${index === 0 ? 90 : index === 1 ? 78 : 66}%`,
                    background: "#e5e2db",
                    borderRadius: 999,
                  }}
                />
                <div
                  style={{
                    height: 9,
                    width: `${index === 0 ? 76 : index === 1 ? 88 : 54}%`,
                    background: "#e5e2db",
                    borderRadius: 999,
                  }}
                />
              </div>
            ))}
            <div
              style={{
                marginTop: "auto",
                background: "#f5e6c0",
                color: "#0f2942",
                borderRadius: 12,
                padding: "16px 18px",
                fontSize: 28,
                fontWeight: 900,
                textAlign: "center",
              }}
            >
              {site.price} once
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
