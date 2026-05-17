import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2E55E0",
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif"
        }}
      >
        LG
      </div>
    ),
    { width: 32, height: 32 }
  );
}
