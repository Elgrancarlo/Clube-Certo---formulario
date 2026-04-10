export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { heart: 56, text: 'text-xl' },
    md: { heart: 72, text: 'text-2xl' },
    lg: { heart: 96, text: 'text-3xl' },
  }
  const { heart, text } = sizes[size]

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Heart SVG */}
      <svg
        width={heart}
        height={heart * 0.92}
        viewBox="0 0 100 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F28FA3" />
            <stop offset="100%" stopColor="#E85A7A" />
          </linearGradient>
        </defs>
        <path
          d="M50 88 C50 88 5 55 5 28 C5 14 16 4 29 4 C37 4 44 8 50 14 C56 8 63 4 71 4 C84 4 95 14 95 28 C95 55 50 88 50 88Z"
          fill="url(#heartGrad)"
        />
        <text
          x="50"
          y="46"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="22"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          s2
        </text>
      </svg>

      {/* Text */}
      <div className={`flex items-baseline gap-1.5 ${text} leading-none`}>
        <span style={{ color: '#E85A7A' }} className="font-bold">s2</span>
        <span className="font-bold text-gray-900">Clube</span>
      </div>
      <div className="text-[10px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
        Saúde &amp; Sucesso
      </div>
    </div>
  )
}
