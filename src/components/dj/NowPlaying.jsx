import { motion } from 'framer-motion'
import { ExternalLink, Radio, TrendingUp } from 'lucide-react'
import useF1Data from '../../hooks/useF1Data.js'

/**
 * Live Spotify panel: now playing (or last played) + top tracks.
 * Hides itself entirely until the Spotify env vars are configured,
 * so the page never shows a broken panel.
 */
export default function NowPlaying() {
  const { data, loading, error } = useF1Data('/api/spotify')

  // Not configured yet or upstream down — vanish gracefully.
  if (error || (!loading && !data)) return null
  if (!loading && !data.nowPlaying && data.recent?.length === 0 && data.topTracks?.length === 0) return null

  const current = data?.nowPlaying
  const lastPlayed = !current && data?.recent?.length > 0 ? data.recent[0] : null
  const headline = current || lastPlayed
  const progress = current?.durationMs ? Math.min(100, (current.progressMs / current.durationMs) * 100) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="panel p-6 mt-5 border-accent/40"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-mono text-xs tracking-[0.25em] text-accent-glow flex items-center gap-2">
          <Radio size={14} /> {current ? 'LIVE FROM THE DECKS' : 'LAST ON THE DECKS'}
        </h2>
        <span className="font-mono text-[10px] text-midgrey flex items-center gap-1.5">
          {current && <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />}
          SPOTIFY · REAL DATA
        </span>
      </div>

      {loading && (
        <div className="flex gap-4 animate-pulse" aria-hidden="true">
          <div className="w-20 h-20 rounded bg-gridline/60 shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-4 w-2/3 rounded bg-gridline/60" />
            <div className="h-3 w-1/3 rounded bg-gridline/60" />
          </div>
        </div>
      )}

      {!loading && headline && (
        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href={headline.url || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex gap-4 items-center group flex-1 min-w-0"
          >
            {headline.art && (
              <img
                src={headline.art}
                alt={`Album art for ${headline.album}`}
                className="w-20 h-20 rounded shadow-glow-blue object-cover shrink-0"
                loading="lazy"
              />
            )}
            <div className="min-w-0">
              <p className="font-display font-semibold text-offwhite truncate group-hover:text-accent-glow transition-colors flex items-center gap-1.5">
                {headline.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </p>
              <p className="text-sm text-midgrey truncate">{headline.artists}</p>
              {progress !== null && (
                <div className="mt-2.5 h-1 rounded bg-gridline overflow-hidden max-w-[220px]">
                  <div className="h-full bg-[#1DB954] rounded" style={{ width: `${progress}%` }} />
                </div>
              )}
              {!current && <p className="mt-1.5 font-mono text-[10px] text-midgrey">decks currently off · most recent spin</p>}
            </div>
          </a>

          {data.topTracks?.length > 0 && (
            <div className="sm:w-64 shrink-0">
              <p className="font-mono text-[10px] tracking-widest text-midgrey mb-2.5 flex items-center gap-1.5">
                <TrendingUp size={11} /> HEAVY ROTATION · LAST 4 WEEKS
              </p>
              <ol className="space-y-1.5">
                {data.topTracks.slice(0, 5).map((t, i) => (
                  <li key={t.url || t.name} className="text-sm truncate">
                    <a href={t.url || '#'} target="_blank" rel="noreferrer" className="hover:text-accent-glow transition-colors text-midgrey">
                      <span className="font-mono text-[10px] text-accent mr-2">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-offwhite">{t.name}</span> · {t.artists}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
