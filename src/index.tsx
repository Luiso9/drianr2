import { Hono } from 'hono'
import { createSessionCookie, isAuthenticated, logoutCookie } from './lib/session'
import { listFolder } from './lib/r2'
import { createPresignedUploadUrl } from './lib/presign'
import LoginPage from './pages/LoginPage'

type Bindings = {
  BUCKET: R2Bucket
  ASSETS: Fetcher
  AUTH_USERNAME: string
  AUTH_PASSWORD: string
  SESSION_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/login', (c) => c.html(<LoginPage />))

app.post('/login', async (c) => {
  const form = await c.req.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (username !== c.env.AUTH_USERNAME || password !== c.env.AUTH_PASSWORD) {
    return c.html(<LoginPage error="Invalid username or password" />, 401)
  }

  const isHttps = new URL(c.req.url).protocol === 'https:'
  const cookie = await createSessionCookie(c.env.SESSION_SECRET, isHttps)
  c.header('Set-Cookie', cookie)
  return c.redirect('/')
})

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[c] as string))
}

// route route route route !!!!!!!!!!!!!!!!!!!!

app.get('/login', (c) => c.html(loginPage()))

app.post('/login', async (c) => {
  const form = await c.req.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (username !== c.env.AUTH_USERNAME || password !== c.env.AUTH_PASSWORD) {
    return c.html(loginPage('Invalid username or password'), 401)
  }

  const isHttps = new URL(c.req.url).protocol === 'https:'
  const cookie = await createSessionCookie(c.env.SESSION_SECRET, isHttps)
  c.header('Set-Cookie', cookie)
  return c.redirect('/')
})

app.get('/logout', (c) => {
  const isHttps = new URL(c.req.url).protocol === 'https:'
  c.header('Set-Cookie', logoutCookie(isHttps))
  return c.redirect('/login')
})

app.use('/api/*', async (c, next) => {
  const authed = await isAuthenticated(c.req.raw, c.env.SESSION_SECRET)
  if (!authed) return c.json({ error: 'unauthorized' }, 401)
  await next()
})

app.get('/api/list', async (c) => {
  const prefix = c.req.query('prefix') ?? ''
  const items = await listFolder(c.env.BUCKET, prefix)
  return c.json({ items })
})

app.get('/api/file/*', async (c) => {
  const key = decodeURIComponent(c.req.path.replace('/api/file/', ''))
  const isDownload = c.req.query('download') === '1'

  const object = await c.env.BUCKET.get(key)
  if (!object) return c.json({ error: 'not found' }, 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('Content-Disposition', `${isDownload ? 'attachment' : 'inline'}; filename="${key.split('/').pop()}"`)

  return new Response(object.body, { headers })
})

app.post('/api/upload-presign', async (c) => {
  const body = await c.req.json<{ filename: string; prefix: string; contentType?: string }>()
  const safeName = body.filename.replace(/^\/+/, '').split('/').pop()

  if (!safeName) return c.json({ error: 'invalid filename' }, 400)

  const key = (body.prefix || '') + safeName
  const contentType = body.contentType || 'application/octet-stream'

  const url = await createPresignedUploadUrl(
    {
      R2_ACCOUNT_ID: c.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
    },
    'backingup', // yes its my bucket name?!
    key,
    contentType
  )

  return c.json({ url, key, method: 'PUT', headers: { 'Content-Type': contentType } })
})

export default app
