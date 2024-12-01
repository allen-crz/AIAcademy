// Path: /src/components/upload-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadButtonProps {
  endpoint: "courseImage" | "lessonVideo"
  onUploadComplete: (url: string) => void
}

export function UploadButton({ endpoint, onUploadComplete }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    try {
      setIsUploading(true)
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/upload/${endpoint}`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onUploadComplete(data.url)
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Error uploading file")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept={endpoint === "courseImage" ? "image/*" : "video/*"}
        className="hidden"
        id="file-upload"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <div>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {endpoint === "courseImage" ? "Upload Image" : "Upload Video"}
              </>
            )}
          </div>
        </Button>
      </label>
    </div>
  )
}