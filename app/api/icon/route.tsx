import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SIZES: Record<string, number> = { "192": 192, "512": 512 };
const DEFAULT_SIZE = 512;

export async function GET(req: NextRequest) {
  const sizeParam = new URL(req.url).searchParams.get("size") ?? "";
  const size = SIZES[sizeParam] ?? DEFAULT_SIZE;
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.28);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2E55E0",
          borderRadius: radius
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-2px"
          }}
        >
          LG
        </span>
      </div>
    ),
    { width: size, height: size }
  );
}
