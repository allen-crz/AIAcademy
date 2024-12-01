// Path: /src/components/dashboard/sign-out-button.tsx
"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={() => signOut({
        callbackUrl: "/sign-in"
      })}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )
}