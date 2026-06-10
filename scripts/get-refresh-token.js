#!/usr/bin/env node
// One-time helper to mint a Spotify refresh token for the portfolio.
//
// Setup (once, in the Spotify Developer Dashboard for your app):
//   1. Add this Redirect URI:  http://127.0.0.1:8888/callback
//   2. Have your Client ID and Client Secret ready (secret stays local!)
//
// Run:
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-refresh-token.js
//
// It opens an auth URL, you approve, and it prints the refresh token.
// Put that + the client ID + secret into Netlify env vars:
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN

import http from 'node:http'
import crypto from 'node:crypto'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '3e0a5913ad80415383daf0d33c9bfb1f'
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT = 'http://127.0.0.1:8888/callback'
const SCOPES = 'user-read-currently-playing user-read-recently-played user-top-read'

if (!CLIENT_SECRET) {
  console.error('Set SPOTIFY_CLIENT_SECRET env var first (never commit it).')
  process.exit(1)
}

const state = crypto.randomBytes(8).toString('hex')
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT,
    state,
  })

console.log('\n1. Open this URL in your browser and approve access:\n')
console.log(authUrl + '\n')
console.log('2. Waiting for Spotify to redirect back...\n')

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:8888')
  if (url.pathname !== '/callback') return res.end()
  const code = url.searchParams.get('code')
  if (url.searchParams.get('state') !== state || !code) {
    res.end('State mismatch or missing code. Try again.')
    return
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  })
  const json = await tokenRes.json()

  if (json.refresh_token) {
    res.end('Done! Check your terminal — you can close this tab.')
    console.log('✅ Your refresh token (add to Netlify env as SPOTIFY_REFRESH_TOKEN):\n')
    console.log(json.refresh_token + '\n')
  } else {
    res.end('Something went wrong — check the terminal.')
    console.error('Token exchange failed:', json)
  }
  server.close()
})

server.listen(8888)
