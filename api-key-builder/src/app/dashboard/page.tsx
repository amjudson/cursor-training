import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/dashboard/keys')
  return null
} 