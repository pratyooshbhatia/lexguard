import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2E55E0",
          borderRadius: 40,
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-2px"
        }}
      >
        LG
      </div>
    ),
    { width: 180, height: 180 }
  );
}
