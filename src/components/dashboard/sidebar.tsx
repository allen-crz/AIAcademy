// Path: /src/components/dashboard/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  GraduationCap,
  BarChart,
  User
} from "lucide-react"

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Courses',
    icon: GraduationCap,
    href: '/courses',
  },
  {
    label: 'Analytics',
    icon: BarChart,
    href: '/analytics',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="border-r h-[calc(100vh-4rem)] w-64 p-4 dark:bg-black">
      <div className="space-y-2">
        {routes.map((route) => (
          <Link href={route.href} key={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === route.href ? 
                "bg-secondary dark:bg-secondary/10" : 
                "hover:bg-secondary/80 dark:hover:bg-secondary/10"
              )}
            >
              <route.icon className="h-4 w-4 mr-2" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}