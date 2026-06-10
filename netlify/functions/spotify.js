// GET /api/spotify
// Returns Priyasnee's live Spotify state for the DJ page:
//   { nowPlaying: {...} | null, recent: [...], topTracks: [...] }
//
// Requires Netlify env vars:
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
// (see scripts/get-refresh-token.js + README for the one-time setup)

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API = 'https://api.spotify.com/v1'

// Cache the short-lived access token across warm invocations
let tokenCache = { token: null, expiresAt: 0 }
// Cache the payload briefly so a burst of visitors = one Spotify call
let dataCache = { data: null, at: 0 }

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.token
  }
  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  const json = await res.json()
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in || 3600) * 1000,
  }
  return tokenCache.token
}

function slimTrack(t) {
  if (!t) return null
  return {
    name: t.name,
    artists: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album?.name,
    art: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || null,
    url: t.external_urls?.spotify || null,
  }
}

export const handler = async () => {
  // 30s payload cache — fresh enough for "now playing", kind to rate limits
  if (dataCache.data && Date.now() - dataCache.at < 30_000) {
    return ok(dataCache.data)
  }

  try {
    const token = await getAccessToken()
    const headers = { Authorization: `Bearer ${token}` }

    const [nowRes, recentRes, topRes] = await Promise.all([
      fetch(`${API}/me/player/currently-playing`, { headers }),
      fetch(`${API}/me/player/recently-played?limit=5`, { headers }),
      fetch(`${API}/me/top/tracks?limit=5&time_range=short_term`, { headers }),
    ])

    // 204 = nothing playing right now
    let nowPlaying = null
    if (nowRes.status === 200) {
      const now = await nowRes.json()
      if (now?.item && now.is_playing) {
        nowPlaying = {
          ...slimTrack(now.item),
          progressMs: now.progress_ms,
          durationMs: now.item.duration_ms,
        }
      }
    }

    const recentJson = recentRes.ok ? await recentRes.json() : { items: [] }
    const topJson = topRes.ok ? await topRes.json() : { items: [] }

    const data = {
      nowPlaying,
      recent: (recentJson.items || []).map((i) => slimTrack(i.track)).filter(Boolean),
      topTracks: (topJson.items || []).map(slimTrack).filter(Boolean),
    }
    dataCache = { data, at: Date.now() }
    return ok(data)
  } catch (err) {
    console.error(err)
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Spotify unavailable', configured: Boolean(process.env.SPOTIFY_REFRESH_TOKEN) }),
    }
  }
}

function ok(body) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30',
    },
    body: JSON.stringify(body),
  }
}
