export const dynamic = "force-dynamic";

import { DashboardTable } from "@/components/dashboard-table";
import { Button } from "@/components/ui/button";
import { utapi } from "@/server/uploadthing";
import { Upload } from "lucide-react";
import Link from "next/link";

async function getFiles() {
  "use server";
  const files = await utapi.listFiles();
  return files;
}

export default async function Home() {
  const data = await getFiles();
  const files = {
    files: data.files,
    hasMore: data.hasMore,
  };
  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">Files</h1>
          <p className="text-sm text-muted-foreground">
            These are all of the files that have been uploaded.
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/upload">
            <Upload size="16" /> Upload
          </Link>
        </Button>
      </div>
      <DashboardTable data={files} />
    </main>
  );
}
