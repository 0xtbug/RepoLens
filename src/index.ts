import { Hono } from 'hono'
import type { Bindings } from './types/github'
import projects from './routes/projects'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('ok')
})

app.route('/projects', projects)

export default app
