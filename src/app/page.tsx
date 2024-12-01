// Path: /src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to LMS Platform</h1>
        <div className="space-x-4">
          <Link 
            href="/sign-in"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link 
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}