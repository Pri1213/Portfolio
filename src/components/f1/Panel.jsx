export function Panel({ title, right, children, className = '' }) {
  return (
    <div className={`panel overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-gridline">
        <h2 className="font-mono text-xs tracking-[0.25em] text-midgrey">{title}</h2>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export function Skeleton({ rows = 6 }) {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-7 rounded bg-gridline/60" />
      ))}
    </div>
  )
}

export function ErrorNote({ message = 'Data unavailable right now. The pit wall is on it.' }) {
  return <p className="font-mono text-xs text-f1red/80">{message}</p>
}
