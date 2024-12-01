// Path: /src/app/(auth)/sign-in/page.tsx
"use client"
import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <Card className="w-full border-none shadow-lg">
      <CardContent className="pt-6 pb-4">
        <SignInForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t p-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link 
            href="/register" 
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Create one now
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}