import { motion, useReducedMotion } from 'framer-motion'

/**
 * Headline that materialises letter by letter out of a speed blur —
 * each glyph decelerates into place like a car braking into the apex.
 * Screen readers get the full label; reduced motion gets static text.
 */
const letterVariant = {
  hidden: { opacity: 0, y: '0.35em', filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function KineticTitle({ lines, label, className = '', delay = 0.3 }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <h1 className={className} aria-label={label}>
        {lines.map((l, i) => (
          <span key={i} aria-hidden="true" className={`block ${l.className || ''}`}>
            {l.text}
          </span>
        ))}
      </h1>
    )
  }

  return (
    <motion.h1 className={className} aria-label={label} initial="hidden" animate="visible">
      {lines.map((l, li) => (
        <motion.span
          key={li}
          aria-hidden="true"
          className={`block ${l.className || ''}`}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.04, delayChildren: delay + li * 0.25 },
            },
          }}
        >
          {/* Words stay unbreakable; letters animate inside them */}
          {l.text.split(' ').map((word, wi, words) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <motion.span key={ci} className="inline-block" variants={letterVariant}>
                  {ch}
                </motion.span>
              ))}
              {wi < words.length - 1 && <span>{' '}</span>}
            </span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  )
}
