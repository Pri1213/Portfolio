// Shared helpers for F1 functions.
// Jolpica is the community-maintained successor to the Ergast API
// (ergast.com was deprecated at the end of 2024). Same response shapes.
export const F1_BASE = 'https://api.jolpi.ca/ergast/f1'

// Simple in-memory cache — survives warm invocations of the same
// function instance, which is enough to stay friendly to rate limits.
const cache = new Map()

export async function cachedFetch(url, ttlMs = 60 * 60 * 1000) {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < ttlMs) return hit.data

  const res = await fetch(url, { headers: { 'User-Agent': 'priyashnee.netlify.app portfolio' } })
  if (!res.ok) throw new Error(`Upstream ${res.status} for ${url}`)
  const data = await res.json()
  cache.set(url, { at: Date.now(), data })
  return data
}

export function ok(body, maxAge = 3600) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${maxAge}`,
    },
    body: JSON.stringify(body),
  }
}

export function fail(err) {
  console.error(err)
  return {
    statusCode: 502,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'F1 data temporarily unavailable' }),
  }
}
