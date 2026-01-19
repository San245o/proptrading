import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { frame: string } }
) {
  const frame = params.frame;

  if (!/^[\w-]+\.jpg$/i.test(frame)) {
    return NextResponse.json({ error: "Invalid frame" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "sequence", frame);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }
}
