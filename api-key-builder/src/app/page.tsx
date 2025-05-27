'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div data-testid="home-container" className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main data-testid="home-main" className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          data-testid="home-logo"
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div data-testid="home-actions" className="flex gap-4 items-center flex-col sm:flex-row">
          {isAuthenticated ? (
            <Link
              data-testid="home-dashboard-link"
              href="/dashboard"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-blue-600 text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto hover:bg-blue-700"
            >
              Go To Dashboard
            </Link>
          ) : (
            <>
              <Link
                data-testid="home-login-link"
                href="/auth/login"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              >
                Sign In
              </Link>
              <Link
                data-testid="home-register-link"
                href="/auth/register"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <div className="mt-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold mb-4">Welcome to API Key Builder</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            A secure platform for managing and generating API keys. Sign in to access your dashboard or create a new account to get started.
          </p>
        </div>
      </main>
      <footer data-testid="home-footer" className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          data-testid="home-learn-link"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          data-testid="home-examples-link"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          data-testid="home-nextjs-link"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
