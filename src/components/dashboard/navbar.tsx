// Path: /src/components/dashboard/navbar.tsx
import Link from "next/link"
import { SignOutButton } from "@/components/dashboard/sign-out-button"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export default function Navbar({ user }: { user: any }) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="font-bold">
          Ai Academy
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}