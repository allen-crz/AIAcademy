// Path: /src/app/(auth)/register/page.tsx
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link 
            href="/sign-in" 
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}