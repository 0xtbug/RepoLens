import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { Bindings } from '../types/github'
import { projectsQuerySchema } from '../schemas/projects'
import { GitHubService } from '../services/github.service'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', zValidator('query', projectsQuerySchema, (result, c) => {
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
    return c.json({ success: false, errors }, 400)
  }
}), async (c) => {
  const { limit, perpage } = c.req.valid('query')
  const username = c.env?.GITHUB_USERNAME

  if (!username) {
    return c.json({ success: false, error: 'GITHUB_USERNAME is not configured' }, 500)
  }

  const token = c.env?.GITHUB_TOKEN
  if (!token) {
    return c.json({ success: false, error: 'GITHUB_TOKEN is not configured' }, 500)
  }

  try {
    const github = new GitHubService(token)
    const repos = await github.fetchRepos(username, perpage)
    const popular = github.getPopularRepos(repos, limit)
    const newRepos = github.getNewRepos(repos, limit)

    return c.text(github.formatMarkdown(popular, newRepos))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ success: false, error: `Failed to fetch repositories: ${message}` }, 502)
  }
})

export default app
