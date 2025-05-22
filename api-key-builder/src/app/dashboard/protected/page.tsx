'use client'

export default function ProtectedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <div className="max-w-4xl w-full space-y-8 p-8 bg-[#23272F] rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Protected Playground
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Welcome to the protected playground area
          </p>
        </div>
        {/* Add your protected content here */}
      </div>
    </div>
  )
} 