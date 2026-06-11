import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Flag, RotateCcw, X } from 'lucide-react'
import { useLang } from '../../i18n.jsx'
import { beep } from '../../experience/sound.js'

/**
 * "The Paddock Quiz" — five multiple-choice questions, each revealing a
 * recruiter-friendly fun fact. Fully bilingual via the i18n context.
 */
export default function Quiz() {
  const { t } = useLang()
  const quiz = t.quiz
  const total = quiz.questions.length

  const [stage, setStage] = useState('start') // start | playing | done
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  const question = quiz.questions[index]
  const grade = quiz.grades.find((g) => score >= g.min) || quiz.grades[quiz.grades.length - 1]

  const reset = () => {
    setStage('playing')
    setIndex(0)
    setPicked(null)
    setScore(0)
  }

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === question.answer) {
      setScore((s) => s + 1)
      beep(980, 0.08, 0.05)
      setTimeout(() => beep(1320, 0.1, 0.05), 90)
    } else {
      beep(220, 0.18, 0.05, 'sawtooth')
    }
  }

  const advance = () => {
    if (index + 1 < total) {
      setIndex(index + 1)
      setPicked(null)
    } else {
      setStage('done')
    }
  }

  return (
    <section id="quiz" className="relative py-24 scanlines">
      <div className="max-w-2xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="racing-bar" aria-hidden="true"><i /><i /></span>
          <p className="eyebrow mb-2">{t.sections.quiz.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.sections.quiz.title}</h2>
          <p className="mt-3 text-midgrey">{quiz.intro}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="panel p-7 min-h-[320px] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {stage === 'start' && (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="flex gap-2" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="w-4 h-4 rounded-full bg-f1red"
                      initial={{ opacity: 0.2 }}
                      whileInView={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ delay: i * 0.25, duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="btn-f1 px-8 py-3 bg-accent text-offwhite hover:bg-accent-glow hover:shadow-glow-blue flex items-center gap-2"
                >
                  <Flag size={16} /> {quiz.start}
                </button>
              </motion.div>
            )}

            {stage === 'playing' && (
              <motion.div
                key={`q-${index}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="font-mono text-xs text-midgrey">{quiz.qOf(index + 1, total)}</p>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {Array.from({ length: total }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-6 h-1 rounded ${i < index ? 'bg-accent' : i === index ? 'bg-accent-glow' : 'bg-gridline'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-display font-semibold text-lg text-offwhite mb-6">{question.q}</p>

                <div className="space-y-2.5">
                  {question.options.map((opt, i) => {
                    const isAnswer = i === question.answer
                    const isPicked = i === picked
                    let style = 'border-gridline hover:border-accent text-offwhite'
                    if (picked !== null) {
                      if (isAnswer) style = 'border-green-500/70 bg-green-500/10 text-offwhite'
                      else if (isPicked) style = 'border-f1red/70 bg-f1red/10 text-offwhite'
                      else style = 'border-gridline text-midgrey'
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => pick(i)}
                        disabled={picked !== null}
                        className={`w-full text-left px-4 py-3 rounded border text-sm transition-all flex items-center justify-between gap-3 ${style}`}
                      >
                        <span>{opt}</span>
                        {picked !== null && isAnswer && <Check size={16} className="text-green-400 shrink-0" />}
                        {picked !== null && isPicked && !isAnswer && <X size={16} className="text-f1red shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {picked !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5"
                    >
                      <p className="text-sm text-midgrey border-l-2 border-accent pl-3 leading-relaxed">
                        {question.fact}
                      </p>
                      <button
                        onClick={advance}
                        className="btn-f1 mt-5 px-6 py-2.5 bg-accent text-offwhite text-sm hover:bg-accent-glow hover:shadow-glow-blue"
                      >
                        {index + 1 < total ? quiz.next : quiz.finish}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {stage === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center gap-4"
              >
                <p className="font-mono text-xs tracking-widest text-midgrey">{quiz.score}</p>
                <p className="font-mono text-5xl font-bold text-accent-glow">
                  {score}/{total}
                </p>
                <p className="font-display font-bold text-xl text-offwhite">{grade.label}</p>
                <p className="text-sm text-midgrey max-w-sm">{grade.text}</p>
                <button
                  onClick={reset}
                  className="btn-f1 mt-2 px-6 py-2.5 border border-accent text-accent-glow text-sm hover:bg-accent/15 flex items-center gap-2"
                >
                  <RotateCcw size={14} /> {quiz.restart}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
