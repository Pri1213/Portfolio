import { useEffect, useState } from 'react'

/**
 * Fetches from a Netlify Function endpoint with loading/error states.
 * Endpoints proxy the Jolpica F1 API (the maintained Ergast successor)
 * and cache responses server-side.
 */
export default function useF1Data(endpoint) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [endpoint])

  return { data, loading, error }
}
