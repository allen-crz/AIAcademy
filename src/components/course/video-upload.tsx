// src/components/course/video-upload.tsx
"use client"

import { Input } from "@/components/ui/input"

interface VideoUploadProps {
  onChange: (file: File) => void;
}

export function VideoUpload({ onChange }: VideoUploadProps) {
  return (
    <Input 
      type="file" 
      accept="video/*"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          onChange(file)
        }
      }}
    />
  )
}