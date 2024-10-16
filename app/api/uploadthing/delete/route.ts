import { NextResponse } from "next/server";

const UPLOADTHING_API_KEY = process.env.UPLOADTHING_API_KEY;

export async function POST(request: Request) {
  const { fileKeys } = await request.json();

  if (!UPLOADTHING_API_KEY) {
    return NextResponse.json(
      {
        error: "UPLOADTHING_API_KEY not set",
      },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.uploadthing.com/v6/deleteFiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Uploadthing-Api-Key": UPLOADTHING_API_KEY,
    },
    body: JSON.stringify({
      fileKeys,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      {
        error: "Failed to delete files" + JSON.stringify(error),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
