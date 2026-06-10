// Approximate 2025/26 constructor colours for pill badges.
// Falls back to accent blue for anything unrecognised.
const COLOURS = {
  red_bull: '#3671C6',
  ferrari: '#E8002D',
  mercedes: '#27F4D2',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#00A1E8',
  williams: '#64C4FF',
  rb: '#6692FF',
  sauber: '#52E252',
  haas: '#B6BABD',
  cadillac: '#C8A55A',
  audi: '#BB0A30',
}

export default function teamColour(constructorId = '') {
  return COLOURS[constructorId] || '#4A7FD4'
}
