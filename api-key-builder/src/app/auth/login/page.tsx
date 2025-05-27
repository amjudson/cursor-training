import { LoginForm } from '@/components/auth/login-form'
import { AuthRoute } from '@/components/auth/auth-route'

export default function LoginPage() {
  return (
    <AuthRoute>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </AuthRoute>
  )
} 