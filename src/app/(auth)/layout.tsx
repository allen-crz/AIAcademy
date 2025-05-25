// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[400px] space-y-6 p-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-primary">
              Ai Academy
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Learn at your own pace, anytime, anywhere
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}