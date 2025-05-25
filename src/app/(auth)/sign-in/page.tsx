// Path: /src/app/(auth)/sign-in/page.tsx
"use client"
import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <Card className="w-full border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardContent className="pt-6 pb-4">
        <SignInForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link 
  href="/register" 
  className="font-medium text-black hover:underline dark:text-white"
>
  Create one now
</Link>

        </div>
      </CardFooter>
    </Card>
  )
}
