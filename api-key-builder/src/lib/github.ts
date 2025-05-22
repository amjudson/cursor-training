import { throwError } from './helperFunctions'

interface GitHubReadmeResponse {
  content: string
  encoding: string
  sha: string
  size: number
  url: string
}

/**
 * Fetches the README content from a GitHub repository
 * @param owner - The repository owner
 * @param repo - The repository name
 * @returns The decoded README content as a string
 */
export async function getGitHubReadme(owner: string, repo: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    )

    if (!response.ok) {
      throwError(`GitHub API responded with status: ${response.status}`)
    }

    const data = (await response.json()) as GitHubReadmeResponse
    
    // GitHub returns content in base64
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch README: ${error.message}`)
    }
    throw new Error('Failed to fetch README: Unknown error')
  }
}

/**
 * Fetches the README content from a GitHub repository with additional metadata
 * @param owner - The repository owner
 * @param repo - The repository name
 * @returns Object containing the README content and metadata
 */
export async function getGitHubReadmeWithMetadata(owner: string, repo: string): Promise<{
  content: string
  sha: string
  size: number
  url: string
}> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    )

    if (!response.ok) {
      throwError(`GitHub API responded with status: ${response.status}`)
    }

    const data = (await response.json()) as GitHubReadmeResponse
    
    return {
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
      sha: data.sha,
      size: data.size,
      url: data.url,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch README: ${error.message}`)
    }
    throw new Error('Failed to fetch README: Unknown error')
  }
}
