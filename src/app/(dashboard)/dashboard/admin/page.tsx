// src/app/(dashboard)/dashboard/admin/page.tsx
"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/courses/create">
          <Card className="p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Simple Course</h3>
                <p className="text-sm text-muted-foreground">Basic course creation</p>
              </div>
              <Plus className="h-8 w-8" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/courses/create-full">
          <Card className="p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Complete Course</h3>
                <p className="text-sm text-muted-foreground">With video and quiz</p>
              </div>
              <Plus className="h-8 w-8" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}