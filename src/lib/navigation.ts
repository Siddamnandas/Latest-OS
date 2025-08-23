export const DEEP_LINK_SCHEME = 'latestos'

/**
 * Convert a deep link URL using the custom scheme into an internal path.
 */
export function parseDeepLink(url: string, scheme: string = DEEP_LINK_SCHEME): string {
  const prefix = `${scheme}://`
  if (url.startsWith(prefix)) {
    const path = url.slice(prefix.length)
    return path.startsWith('/') ? path : `/${path}`
  }
  return url
}

/**
 * Handle an incoming deep link by navigating with the provided router.
 * The router only needs to expose a `push` method (Next.js router or React Navigation).
 */
export function handleDeepLink(
  url: string,
  router: { push: (path: string) => void },
  scheme: string = DEEP_LINK_SCHEME
) {
  const path = parseDeepLink(url, scheme)
  router.push(path)
}
