export type Bindings = {
  GITHUB_TOKEN: string
  GITHUB_USERNAME: string
}

export interface GitHubRepo {
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  created_at: string
  fork: boolean
}
