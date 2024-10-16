import { createUploadthing, type FileRouter } from "uploadthing/next";
import { revalidateTag } from "next/cache";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 100 },
  }).onUploadComplete(async ({ metadata, file }) => {
    // This code RUNS ON YOUR SERVER after upload
    console.log("file url", file.url);

    // revalidate the files list
    revalidateTag("filesList");
    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    return { uploadedBy: metadata };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
