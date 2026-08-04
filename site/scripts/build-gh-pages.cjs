// Cross-platform equivalent of:
//   NUXT_APP_BASE_URL=/BigSmart-Open/ nuxt build --preset github_pages
// Used by the `build:pages` script so the GitHub Pages artifact can be
// built locally on any shell (cmd/PowerShell included).
const { spawnSync } = require('node:child_process')

const env = {
  ...process.env,
  NUXT_APP_BASE_URL: process.env.NUXT_APP_BASE_URL || '/BigSmart-Open/'
}

const result = spawnSync('nuxt build --preset github_pages', {
  stdio: 'inherit',
  shell: true,
  env
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
