"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Copy, Ellipsis, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const Spinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 576 512"
    >
      <path
        fill="currentColor"
        d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
      />
    </svg>
  );
};

type FilesList = {
  hasMore: boolean;
  files: {
    name: string;
    customId: string | null;
    key: string;
    status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
    id: string;
  }[];
};

export function DashboardTable() {
  const [data, setData] = useState<FilesList>();
  const [searchKey, setSearchKey] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/uploadthing/files", {
        next: { tags: ["filesList"] },
      });
      const updatedData = await res.json();
      setData(updatedData);
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <Spinner />
      </div>
    );
  }

  const filterFiles = () => {
    const files = data.files;
    if (searchKey === "") {
      return files;
    }
    return files.filter((file) => {
      return file.name.toLowerCase().includes(searchKey.toLowerCase());
    });
  };

  const filteredFiles = filterFiles();

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Search files"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">File Name</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead className="text-right">File Link</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles &&
            filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>
                  <Image
                    src={`https://utfs.io/f/${file.key}`}
                    alt={file.name}
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={`https://utfs.io/f/${file.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`https://utfs.io/f/${file.key}`}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis size="16" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="gap-2 flex items-center"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://utfs.io/f/${file.key}`
                          );
                        }}
                      >
                        <Copy size="16" /> Copy File Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 flex items-center text-red-500"
                        onClick={async () => {
                          await fetch(`/api/uploadthing/delete`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              fileKeys: [file.key],
                            }),
                          });
                          setTimeout(fetchData, 1000);
                        }}
                      >
                        <Trash size="16" /> Delete File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {filteredFiles && filteredFiles.length === 0 && (
        <div className="flex items-center justify-center p-4">
          {searchKey ? `No Files Found for "${searchKey}"` : "No Files Found"}
        </div>
      )}
    </div>
  );
}
