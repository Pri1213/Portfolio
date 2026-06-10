// GET /api/f1-standings?type=drivers|constructors
import { F1_BASE, cachedFetch, ok, fail } from './_shared.js'

export const handler = async (event) => {
  const type = event.queryStringParameters?.type === 'constructors' ? 'constructors' : 'drivers'
  const endpoint =
    type === 'drivers'
      ? `${F1_BASE}/current/driverstandings.json`
      : `${F1_BASE}/current/constructorstandings.json`
  try {
    const data = await cachedFetch(endpoint)
    const lists = data?.MRData?.StandingsTable?.StandingsLists?.[0] ?? {}
    return ok({
      season: data?.MRData?.StandingsTable?.season,
      round: lists.round,
      standings: type === 'drivers' ? lists.DriverStandings ?? [] : lists.ConstructorStandings ?? [],
      type,
    })
  } catch (err) {
    return fail(err)
  }
}
