// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next"
 
const f = createUploadthing()
 
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get session user
      return { userId: "test" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter
 
export type OurFileRouter = typeof ourFileRouter