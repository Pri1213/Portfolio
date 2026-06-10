import { motion } from 'framer-motion'

/**
 * Broadcast lower-third: red/blue racing bars wipe in, then the
 * condensed italic title slides in from the left like a name strap.
 */
export default function SectionHeading({ eyebrow, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -36 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <span className="racing-bar" aria-hidden="true"><i /><i /></span>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="font-display text-4xl sm:text-5xl font-bold text-offwhite">{title}</h2>
    </motion.div>
  )
}
