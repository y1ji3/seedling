import { useEffect, useState, type ReactNode } from 'react'

// Figma frame size (iPhone 16/17 Pro-ish) — screens are designed at this resolution.
export const SCREEN_W = 402
export const SCREEN_H = 874
const BEZEL = 12
const CAPTION = 56

function useFitScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => {
      const h = (window.innerHeight - CAPTION - 32) / (SCREEN_H + BEZEL * 2)
      const w = (window.innerWidth - 32) / (SCREEN_W + BEZEL * 2)
      setScale(Math.min(1, h, w))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

/** Time, camera island and signal / wifi / battery — sits in the safe-top area. */
function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-safe-top items-start text-black">
      <div className="flex h-[48px] flex-1 items-center justify-center pl-4 text-[16px] font-semibold tracking-tight">9:41</div>
      <div className="mt-[11px] h-[37px] w-[126px] shrink-0 rounded-full bg-black" />
      <div className="flex h-[48px] flex-1 items-center justify-center gap-[6px] pr-4">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.1-1.2A10.3 10.3 0 0 0 8 1 10.3 10.3 0 0 0 .9 3.8L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.9 6.9 0 0 0 8 4.3a6.9 6.9 0 0 0-4.7 1.8l1.1 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.3c.6 0 1.1.2 1.5.6L8 11.5 6.5 9.8c.4-.4.9-.6 1.5-.6Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

export default function PhoneFrame({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  const scale = useFitScale()
  const outerW = SCREEN_W + BEZEL * 2
  const outerH = SCREEN_H + BEZEL * 2

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-black py-4">
      {/* Reserve the scaled footprint so the layout doesn't jump. */}
      <div style={{ width: outerW * scale, height: outerH * scale }}>
        <div
          className="relative origin-top-left rounded-[64px] bg-[#1c1c1e] shadow-[0_0_0_2px_#3a3a3c,0_30px_80px_rgba(0,0,0,0.6)]"
          style={{ width: outerW, height: outerH, padding: BEZEL, transform: `scale(${scale})` }}
        >
          {/* Side buttons */}
          <span className="absolute -left-[3px] top-[180px] h-[34px] w-[3px] rounded-l bg-[#3a3a3c]" />
          <span className="absolute -left-[3px] top-[240px] h-[64px] w-[3px] rounded-l bg-[#3a3a3c]" />
          <span className="absolute -left-[3px] top-[318px] h-[64px] w-[3px] rounded-l bg-[#3a3a3c]" />
          <span className="absolute -right-[3px] top-[260px] h-[100px] w-[3px] rounded-r bg-[#3a3a3c]" />

          <div
            className="relative overflow-hidden rounded-[52px] bg-white"
            style={{ width: SCREEN_W, height: SCREEN_H }}
          >
            {children}
            <StatusBar />
            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-white/50" style={{ height: CAPTION - 16 }}>
        {caption}
      </div>
    </div>
  )
}
