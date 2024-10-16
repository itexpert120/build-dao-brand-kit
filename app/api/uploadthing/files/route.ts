export const revalidate = 5;

import { utapi } from "@/server/uploadthing";
import { NextResponse } from "next/server";

export async function GET() {
  "use server";
  try {
    const files = await utapi.listFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
