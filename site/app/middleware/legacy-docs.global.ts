import { legacyDocsRedirect } from '#shared/utils/siteRoutes'

export default defineNuxtRouteMiddleware((to) => {
  const redirect = legacyDocsRedirect(to.path)

  if (redirect) {
    return navigateTo(redirect, {
      redirectCode: 301,
      replace: true
    })
  }
})
