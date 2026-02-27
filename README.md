# RepoLens

A lightweight API built with **HonoJS** on **Cloudflare Workers** that fetches your GitHub repositories and returns them as Markdown — split into **🌟 Popular Projects** and **🆕 New Projects**.

## 📋 Features

- Fetches repositories from the GitHub REST API by username
- Filters out forked repos (shows only original work)
- Top 3 most starred repos → Popular Projects
- Top 3 newest repos → New Projects
- Returns formatted Markdown with clickable links
- Zod query validation via `@hono/zod-validator`
- Proper error handling (400 / 500 / 502)

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file for local development:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_github_username
```

Or set them as Cloudflare secrets for production:

```bash
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_USERNAME
```

### 3. Run locally

```bash
npm run dev
```

### 4. Test the endpoint

```
http://localhost:8787/projects
http://localhost:8787/projects?limit=5&perpage=50
```

### 5. Deploy to Cloudflare Workers

```bash
npm run deploy
```

## 📡 API

### `GET /projects`

Returns a Markdown-formatted list of your top repositories. Username is read from the `GITHUB_USERNAME` environment variable.

**Query Parameters:**

| Param     | Required | Description                                          |
|-----------|----------|------------------------------------------------------|
| `limit`   | ❌        | Number of repos per category (1–500, default: 3)     |
| `perpage` | ❌        | Repos to fetch from GitHub API (1–1000, default: 30) |

**Example Response:**

```markdown
## 🌟 Popular Project
- [repo-name](https://github.com/user/repo-name) - A cool project

## 🆕 New Project
- [new-repo](https://github.com/user/new-repo) - Just created this
```

**Environment Variables:**

| Variable          | Required | Description      |
|-------------------|----------|------------------|
| `GITHUB_TOKEN`    | ✅        | GitHub API token   |
| `GITHUB_USERNAME` | ✅        | GitHub username    |

**Error Responses:**

| Status | Description                        |
|--------|------------------------------------|
| 400    | Invalid query parameters           |
| 500    | Missing env var (token or username)|
| 502    | GitHub API request failed          |

## 📌 Use in GitHub Profile README

You can auto-update your GitHub profile README with your projects using the included GitHub Action.

### 1. Deploy this API to Cloudflare Workers

```bash
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_USERNAME
npm run deploy
```

### 2. Add markers to your profile README

In your profile repo (`username/username`), add these markers where you want the projects to appear:

```markdown
<!-- PROJECTS:START -->
<!-- PROJECTS:END -->
```

### 3. Copy the GitHub Action

Copy `.github/workflows/update-readme.yml` to your profile repo.

### 4. Add the repo secret

Go to your profile repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

- **Name:** `PROJECTS_API_URL`
- **Value:** `https://github-stats.<your-subdomain>.workers.dev/projects`

### 5. Trigger the action

Run the action manually from the **Actions** tab, or wait for the next scheduled run (every 12 hours).
