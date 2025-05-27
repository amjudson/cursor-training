'use client'

import { useState } from 'react'
import { getGitHubReadme } from '@/lib/github'
import {ResponseSchema, summarizeReadme} from '@/utilities/github-summarizer'

export function GitHubReadmeForm() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [readme, setReadme] = useState('')
  const [summary, setSummary] = useState<ResponseSchema>({ summary: '', cool_facts: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setReadme('')

    try {
      const content = await getGitHubReadme(owner, repo)
      setReadme(content)
      const result = await summarizeReadme(content)
      setSummary(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch README')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-300 mb-1">
            Repository Owner
          </label>
          <input
            type="text"
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-3 py-2 bg-[#181C23] border border-[#23272F] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., microsoft"
            required
          />
        </div>
        <div>
          <label htmlFor="repo" className="block text-sm font-medium text-gray-300 mb-1">
            Repository Name
          </label>
          <input
            type="text"
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-3 py-2 bg-[#181C23] border border-[#23272F] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., vscode"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Fetch README'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {readme && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-300 mb-2">README Content:</h3>
          <div className="p-4 bg-[#181C23] border border-[#23272F] rounded-lg">
            <pre className="whitespace-pre-wrap text-gray-300 text-sm">
              <span>Summary:</span>{summary.summary}
              <hr/>
              <span>Cool Facts</span>{ summary.cool_facts.map((fact, index) => (
              <div key={index} className="mt-2">
                <span className="text-gray-400">- {fact}</span>
              </div>
            ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
} 