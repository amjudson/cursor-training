import { GitHubReadmeForm } from '@/components/github-readme-form'

export default function GitHubReadmePage() {
  return (
    <div className="min-h-screen bg-[#15181E] text-white">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">GitHub README Viewer</h1>
        <GitHubReadmeForm />
      </div>
    </div>
  )
} 