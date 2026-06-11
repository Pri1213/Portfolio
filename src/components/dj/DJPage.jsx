import { motion } from 'framer-motion'
import { Disc3, GitCommit, ListMusic, Music } from 'lucide-react'
import Visualizer from './Visualizer.jsx'
import NowPlaying from './NowPlaying.jsx'

// Life as a tracklist — every "track" is a real interest, straight off the CV.
const SETLIST = [
  { n: '01', track: 'Lights Out', artist: 'Formula 1', bpm: '∼220 km/h', note: 'Race strategy and telemetry. I watch for the pit walls, stay for the data.' },
  { n: '02', track: 'Footwork', artist: 'Classical Dance', bpm: 'adagio', note: 'Precision and timing, long before SQL taught me either.' },
  { n: '03', track: 'Kiai', artist: 'Karate · black belt', bpm: 'fortissimo', note: 'Black belt, competitive. The only environment where shouting at the problem is the documented approach.' },
  { n: '04', track: 'Negative Split', artist: '10K Running', bpm: '∼170 spm', note: 'Chasing personal bests the way I chase pipeline runtimes — obsessively, in the rain.' },
  { n: '05', track: 'Untitled Mix (WIP)', artist: 'DJing', bpm: '124', note: 'Work in progress. Mix notes below.', live: true },
  { n: '06', track: "Bobby's Theme (Zoomies Edit)", artist: 'Bobby, dachshund', bpm: 'variable', note: 'Studio assistant. Long body, short legs, strong opinions on bass frequencies.' },
]

// The learning journey, as commit history.
const COMMITS = [
  { week: 'week 1', msg: "couldn't beatmatch. opened a ticket against the hardware." },
  { week: 'week 3', msg: 'first clean transition. zero witnesses. devastating.' },
  { week: 'week 5', msg: 'discovered the sync button. felt guilty. shipped it anyway.' },
  { week: 'week 8', msg: 'trending upward. small sample size, wide confidence interval.' },
]

const VIBES = ['Afrobeats', 'Amapiano', 'Electronic', 'Whatever turns a kitchen into a club']

export default function DJPage() {
  return (
    <main id="main-content" className="pt-28 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="eyebrow mb-3">// off the clock</p>
          <span className="racing-bar" aria-hidden="true"><i /><i /></span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold">Off the Clock</h1>
          <p className="mt-3 text-midgrey">
            Learning to mix. Work in progress. Still better than the pipeline on a bad day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="panel p-5 mt-10"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-widest text-midgrey flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-glow animate-pulse" /> NOW PLAYING
            </p>
            <p className="font-mono text-[10px] text-midgrey truncate ml-3">untitled_mix_final_FINAL_v3.wav</p>
          </div>
          <Visualizer />
        </motion.div>

        <NowPlaying />

        {/* THE SET LIST — life as a tracklist */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="panel p-6 mt-5"
        >
          <h2 className="font-mono text-xs tracking-[0.25em] text-accent-glow mb-1 flex items-center gap-2">
            <ListMusic size={14} /> THE SET LIST
          </h2>
          <p className="text-xs text-midgrey mb-6">Everything I do off the clock, sequenced like a mix.</p>
          <div className="space-y-1">
            {SETLIST.map((t, i) => (
              <motion.div
                key={t.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`group rounded px-3 py-3 border transition-colors ${
                  t.live ? 'border-accent/50 bg-accent/5' : 'border-transparent hover:border-gridline hover:bg-dark'
                }`}
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-mono text-xs text-midgrey">{t.n}</span>
                  <span className="font-display font-semibold text-offwhite">
                    {t.track}
                    {t.live && <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-glow align-middle">LIVE</span>}
                  </span>
                  <span className="text-sm text-midgrey">— {t.artist}</span>
                  <span className="ml-auto font-mono text-[11px] text-accent-glow">{t.bpm}</span>
                </div>
                <p className="mt-1 pl-8 text-sm text-midgrey">{t.note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {/* MIX NOTES — learning journey as commit history */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="panel panel-hover p-6"
          >
            <h2 className="font-mono text-xs tracking-[0.25em] text-accent-glow mb-5 flex items-center gap-2">
              <Disc3 size={14} /> MIX NOTES · COMMIT HISTORY
            </h2>
            <div className="space-y-4 font-mono text-xs">
              {COMMITS.map((c) => (
                <div key={c.week} className="flex gap-3">
                  <GitCommit size={14} className="text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-midgrey">{c.week}</p>
                    <p className="text-offwhite mt-0.5 break-words">git commit -m &quot;{c.msg}&quot;</p>
                  </div>
                </div>
              ))}
              <p className="text-midgrey pt-2 border-t border-gridline">
                main branch: still can&apos;t beatmatch by ear. CI passing anyway.
              </p>
            </div>
          </motion.div>

          {/* CURRENTLY VIBING */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="panel panel-hover p-6"
          >
            <h2 className="font-mono text-xs tracking-[0.25em] text-accent-glow mb-5 flex items-center gap-2">
              <Music size={14} /> CURRENTLY VIBING
            </h2>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <span key={v} className="font-mono text-xs px-3 py-1.5 rounded-full border border-gridline text-offwhite bg-dark">
                  {v}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-midgrey">
              The rotation changes weekly. The Afrobeats does not. Some things in this stack are immutable.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="panel p-6 mt-5 border-accent/40"
        >
          <p className="text-sm text-midgrey leading-relaxed">
            <span className="text-offwhite font-medium">Fun fact:</span> DJing and data engineering have more in
            common than you think. Both require timing precision, understanding your audience, knowing when to
            drop the beat — and when the pipeline drops, everyone notices.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
