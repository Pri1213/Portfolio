/**
 * Synthesized sound design — zero audio files.
 * OFF by default (recruiters browse at work); toggle in navbar persists.
 * Browsers require a user gesture before audio: the toggle click is it.
 */
let ctx = null
let enabled = false

function safeLocal(action, key, value) {
  try {
    if (action === 'get') return localStorage.getItem(key)
    localStorage.setItem(key, value)
  } catch { return null }
}

export function isSoundOn() { return enabled }

export function setSound(on) {
  enabled = on
  safeLocal('set', 'sound', on ? '1' : '0')
  if (on) {
    init()
    beep(880, 0.06, 0.05)
  }
}

function init() {
  if (ctx) { ctx.resume?.(); return }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  } catch { /* no audio support */ }
}

export function beep(freq, dur, vol = 0.03, type = 'square') {
  if (!enabled || !ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch { /* never let sound break the page */ }
}

/** Engine fly-by: pitch sweep with noise-ish saw, for the F1DriveBy. */
export function engineRev() {
  if (!enabled || !ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(90, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.9)
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 2.0)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.1)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 2.1)
  } catch { /* noop */ }
}

export function attachSound() {
  enabled = safeLocal('get', 'sound') === '1'
  if (enabled) init()
  const over = (e) => { if (e.target.closest?.('a, button')) beep(1320, 0.03, 0.014) }
  const click = (e) => {
    if (e.target.closest?.('a, button')) {
      beep(740, 0.05, 0.03)
      setTimeout(() => beep(1100, 0.06, 0.025), 45)
    }
  }
  document.addEventListener('pointerenter', over, true)
  document.addEventListener('pointerdown', click, true)
  return () => {
    document.removeEventListener('pointerenter', over, true)
    document.removeEventListener('pointerdown', click, true)
  }
}
