import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center gap-4 py-8 px-4 text-center">
      <h1 className="text font-bold">Build DAO Brand Kit</h1>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/upload">Upload</Link>
        </Button>
      </div>
    </header>
  );
}
