import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.fullName} — Leaderboards, Builds & Market`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 35%, #1a1410 0%, #0a0a0f 70%)",
          color: "#f5e7c4",
          fontFamily: "serif",
          padding: "80px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #c9a84c 25%, #c9a84c 75%, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #c9a84c 25%, #c9a84c 75%, transparent)",
          }}
        />
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.4em",
            color: "#c9a84c",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Chronicle of Champions
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1.05,
            background:
              "linear-gradient(180deg, #f5e7c4 0%, #c9a84c 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          {SITE.fullName}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a8a09a",
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          Leaderboards · Builds · Market · Maps · Classes
        </div>
      </div>
    ),
    { ...size }
  );
}
