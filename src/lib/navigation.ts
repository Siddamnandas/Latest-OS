export const DEEP_LINK_SCHEME = 'latestos'

/**
 * Convert a deep link URL using the custom scheme into an internal path.
 */
export function parseDeepLink(url: string, scheme: string = DEEP_LINK_SCHEME): string {
  const prefix = `${scheme}://`
  if (url.startsWith(prefix)) {
    const strippedPath = url.slice(prefix.length)
    return strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`
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
  router.push(parseDeepLink(url, scheme))
}
