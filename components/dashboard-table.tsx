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
import { useMemo, useState } from "react";
import { Copy, Ellipsis, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashBoardTableProps {
  data: {
    readonly files: readonly {
      readonly name: string;
      readonly customId: string | null;
      readonly key: string;
      readonly status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
      readonly id: string;
    }[];
    readonly hasMore: boolean;
  };
}

export function DashboardTable({ data }: DashBoardTableProps) {
  const [searchKey, setSearchKey] = useState("");

  const filteredFiles = useMemo(() => {
    const files = data.files;
    if (searchKey === "") {
      return files;
    }
    return files.filter((file) => {
      return file.name.toLowerCase().includes(searchKey.toLowerCase());
    });
  }, [data.files, searchKey]);

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
          {filteredFiles.map((file) => (
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
                      onClick={() => {
                        fetch(`/api/uploadthing/delete`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            fileKeys: [file.key],
                          }),
                        });
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
      {filteredFiles.length === 0 && (
        <div className="flex items-center justify-center p-4">
          {searchKey ? `No Files Found for "${searchKey}"` : "No Files Found"}
        </div>
      )}
    </div>
  );
}
