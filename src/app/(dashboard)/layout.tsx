// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Navbar from "@/components/dashboard/navbar"
import Sidebar from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  // Check if the current path is a lesson page
  const isLessonPage = false // We'll remove this as we're moving lesson pages

  return (
    <div className="h-full">
      <Navbar user={session.user} />
      <div className="flex h-full pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}