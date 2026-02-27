import type { GitHubRepo } from '../types/github'

export class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async fetchRepos(username: string, perpage = 30): Promise<GitHubRepo[]> {
    const url = `https://api.github.com/users/${username}/repos?per_page=${perpage}&sort=created`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'User-Agent': 'repolens',
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!res.ok) {
      let errorMessage = `GitHub API error (${res.status})`
      try {
        const body = await res.json() as { message?: string }
        if (body.message) {
          errorMessage = `${errorMessage}: ${body.message}`
        }
      } catch {
      }
      throw new Error(errorMessage)
    }

    const repos: GitHubRepo[] = await res.json()
    return repos.filter((repo) => !repo.fork)
  }

  getPopularRepos(repos: GitHubRepo[], limit = 3): GitHubRepo[] {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit)
  }

  getNewRepos(repos: GitHubRepo[], limit = 3): GitHubRepo[] {
    return [...repos]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  formatMarkdown(popular: GitHubRepo[], newRepos: GitHubRepo[]): string {
    const formatList = (repos: GitHubRepo[]) =>
      repos.map((r) => `- [${r.name}](${r.html_url}) - ${r.description ?? 'No description'}`).join('\n')

    return `## 🌟 Popular Project\n${formatList(popular)}\n\n## 🆕 New Project\n${formatList(newRepos)}`
  }
}
