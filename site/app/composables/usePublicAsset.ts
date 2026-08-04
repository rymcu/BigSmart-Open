export function usePublicAsset() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.app.baseURL.endsWith('/')
    ? runtimeConfig.app.baseURL
    : `${runtimeConfig.app.baseURL}/`

  return (path: string) => `${baseURL}${path.replace(/^\/+/, '')}`
}
