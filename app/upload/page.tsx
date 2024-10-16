"use client";

import { UploadDropzone } from "@/utils/uploadthing";

export default function UploadPage() {
  return (
    <main className="flex flex-col items-stretch p-4">
      <UploadDropzone endpoint="imageUploader" />
    </main>
  );
}
