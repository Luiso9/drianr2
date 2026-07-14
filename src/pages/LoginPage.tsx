interface LoginPageProps {
  error?: string
}

export default function LoginPage({ error }: LoginPageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login — File Viewer</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className="bg-nord6 min-h-screen flex items-center justify-center px-4">
        <div
          className="border border-nord4 bg-nord6 w-full max-w-sm p-6"
          style={{ borderRadius: '3px', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="mb-5">
            <div
              className="text-nord3 mb-1"
              style={{ fontSize: '11px', letterSpacing: '0.5px' }}
            >
              FILE VIEWER
            </div>
            <h1 className="text-nord1 font-medium" style={{ fontSize: '15px' }}>
              Sign in to continue
            </h1>
          </div>

          {error && (
            <div
              className="border border-nord11 bg-nord11/10 text-nord11 px-3 py-2 mb-4"
              style={{ borderRadius: '2px', fontSize: '12px' }}
            >
              {error}
            </div>
          )}

          <form method="POST" action="/login" className="space-y-3">
            <div>
              <label
                className="block text-nord3 mb-1"
                style={{ fontSize: '11px', letterSpacing: '0.3px' }}
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                autoFocus
                className="w-full px-3 py-2 bg-nord5 border border-nord4 focus:border-nord9 focus:outline-none text-nord1 placeholder-nord3 transition-colors"
                style={{ borderRadius: '2px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label
                className="block text-nord3 mb-1"
                style={{ fontSize: '11px', letterSpacing: '0.3px' }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 bg-nord5 border border-nord4 focus:border-nord9 focus:outline-none text-nord1 placeholder-nord3 transition-colors"
                style={{ borderRadius: '2px', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-nord10 hover:bg-nord9 text-nord6 font-medium py-2 mt-2 transition-colors"
              style={{ borderRadius: '2px', fontSize: '13px' }}
            >
              Log in
            </button>
          </form>
        </div>
      </body>
    </html>
  )
}
