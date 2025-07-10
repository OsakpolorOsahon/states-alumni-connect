import { createUploadthing, type FileRouter } from "uploadthing/server";
import type { Request } from "express";

const f = createUploadthing<Request>();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  memberPhotos: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: req.body.userId || "unknown" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log("Photo upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { fileUrl: file.url };
    }),
    
  duesProofs: f({ "application/pdf": { maxFileSize: "16MB" }, image: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      return { userId: req.body.userId || "unknown" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Dues proof upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;