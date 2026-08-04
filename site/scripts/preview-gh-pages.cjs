const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(process.argv[2] || '.output/public')
const prefix = '/BigSmart-Open'
const port = Number(process.argv[3] || 4173)

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.glb', 'model/gltf-binary'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.woff2', 'font/woff2']
])

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type })
  res.end(body)
}

function resolveFile(pathname) {
  let filePath = path.join(root, pathname)
  if (!filePath.startsWith(root)) return null

  if (pathname.endsWith('/')) filePath = path.join(filePath, 'index.html')
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  if (!fs.existsSync(filePath)) {
    const fallback = path.join(root, pathname, 'index.html')
    if (fs.existsSync(fallback)) filePath = fallback
  }

  return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : null
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  let pathname = decodeURIComponent(url.pathname)

  if (pathname === prefix) {
    res.writeHead(302, { location: `${prefix}/` })
    res.end()
    return
  }

  if (!pathname.startsWith(`${prefix}/`)) {
    send(res, 404, 'Not found')
    return
  }

  pathname = pathname.slice(prefix.length) || '/'
  const filePath = resolveFile(pathname)
  if (!filePath) {
    send(res, 404, 'Not found')
    return
  }

  res.writeHead(200, {
    'content-type': types.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream'
  })
  fs.createReadStream(filePath).pipe(res)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing preview server or pass another port:`)
    console.error(`  node scripts/preview-gh-pages.cjs .output/public ${port + 1}`)
    process.exit(1)
  }
  throw error
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview: http://127.0.0.1:${port}${prefix}/`)
})
