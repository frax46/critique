import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  return (
    <nav className="flex space-x-4 mb-6">
      <Button asChild variant="ghost">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/dashboard/questions">Questions</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/admin/subscription-tiers">Subscription Tiers</Link>
      </Button>
    </nav>
  )
}