// GET /api/f1-schedule — current season race calendar
import { F1_BASE, cachedFetch, ok, fail } from './_shared.js'

export const handler = async () => {
  try {
    const data = await cachedFetch(`${F1_BASE}/current.json`, 6 * 60 * 60 * 1000)
    return ok({
      season: data?.MRData?.RaceTable?.season,
      races: data?.MRData?.RaceTable?.Races ?? [],
    }, 21600)
  } catch (err) {
    return fail(err)
  }
}
