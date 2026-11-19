import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { useNav, type ScreenId } from '../nav'
import seedPacket from '../assets/seed-packet.png'
import helpIcon from '../assets/help.png'
import menuIcon from '../assets/menu.png'
import cancelIcon from '../assets/cancel.png'
import pencilIcon from '../assets/pencil.png'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- Icons ---------- */

const svg = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.25, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
export const ArrowLeft = () => <svg viewBox="0 0 24 24" className="size-5" {...svg}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
export const ArrowRight = () => <svg viewBox="0 0 24 24" className="size-4" {...svg}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
const Plus = () => <svg viewBox="0 0 24 24" className="size-7" {...svg} strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
export const Check = ({ className = 'size-2.5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...svg} strokeWidth={3.5}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

/* ---------- Layout ---------- */

/**
 * A 402×874 screen: optional fixed `top` bar, scrolling content, optional fixed
 * `bottom` action area, and an optional floating add button.
 */
export function Screen({
  children,
  top,
  bottom,
  fab,
  overlay,
  tone = 'white',
}: {
  children: ReactNode
  top?: ReactNode
  bottom?: ReactNode
  fab?: ScreenId
  overlay?: ReactNode
  tone?: 'white' | 'canvas'
}) {
  return (
    <div className={cx('absolute inset-0 flex flex-col motion-safe:animate-screen', tone === 'canvas' ? 'bg-canvas' : 'bg-white')}>
      {top && <div className="shrink-0 px-5 pt-safe-top pb-2">{top}</div>}
      <div
        className={cx(
          'no-scrollbar flex-1 overflow-y-auto px-5',
          !top && 'pt-safe-top',
          bottom ? 'pb-6' : fab ? 'pb-32' : 'pb-[calc(var(--spacing-safe-bottom)+24px)]',
        )}
      >
        {children}
      </div>
      {bottom && (
        <div className="shrink-0 border-t border-line-soft px-5 pt-4 pb-[calc(var(--spacing-safe-bottom)+8px)]">{bottom}</div>
      )}
      {fab && <Fab to={fab} />}
      {overlay}
    </div>
  )
}

export function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
    >
      {children}
    </button>
  )
}

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton label="Close" onClick={onClick}>
    <img src={cancelIcon} alt="" className="size-5" />
  </IconButton>
)

export const EditButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton label="Edit" onClick={onClick}>
    <img src={pencilIcon} alt="" className="size-5 opacity-60" />
  </IconButton>
)

export function MenuButton() {
  const { openMenu } = useNav()
  return (
    <IconButton label="Menu" onClick={openMenu}>
      <img src={menuIcon} alt="" className="size-[22px]" />
    </IconButton>
  )
}

export function AppHeader() {
  const { go } = useNav()
  return (
    <div className="-mx-2 flex h-11 items-center justify-between">
      <button
        onClick={() => go('home')}
        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl px-2 transition-colors hover:bg-black/5"
      >
        <img src={seedPacket} alt="" className="size-7" />
        <span className="text-[20px] font-bold italic tracking-tight text-olive">Seedling</span>
      </button>
      <div className="flex">
        <IconButton label="Help">
          <img src={helpIcon} alt="" className="size-6" />
        </IconButton>
        <MenuButton />
      </div>
    </div>
  )
}

/** Back link on the left, icon actions on the right — the top bar for detail / edit screens. */
export function SubBar({ back, onBack, action }: { back: string; onBack: () => void; action?: ReactNode }) {
  return (
    <div className="-mx-2 flex h-11 items-center justify-between">
      <button
        onClick={onBack}
        className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl px-2 text-label text-ink transition-colors hover:bg-black/5"
      >
        <ArrowLeft />
        {back}
      </button>
      {action}
    </div>
  )
}

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cx('text-title text-ink', className)}>{children}</h1>
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-2 flex h-9 items-center justify-between">
      <h2 className="text-section text-ink">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="-mr-1.5 flex h-9 cursor-pointer items-center gap-1 rounded-lg px-1.5 text-label text-olive transition-colors hover:bg-olive-tint"
        >
          {action}
          <ArrowRight />
        </button>
      )}
    </div>
  )
}

export function Card({ children, variant = 'filled', className }: { children: ReactNode; variant?: 'filled' | 'outline'; className?: string }) {
  return (
    <div className={cx('rounded-2xl p-4', variant === 'filled' ? 'bg-card' : 'border border-line-soft bg-white', className)}>
      {children}
    </div>
  )
}

/** Small uppercase label that groups rows inside a card (Today / Tomorrow / Week). */
export function Group({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-0.5 text-caption tracking-wide text-muted uppercase">{label}</p>
      {children}
    </div>
  )
}

/* ---------- Controls ---------- */

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  className,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  size?: 'lg' | 'sm'
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'inline-flex w-full cursor-pointer items-center justify-center rounded-xl font-bold whitespace-nowrap transition active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive',
        size === 'lg' ? 'h-12 px-5 text-[15px]' : 'h-10 px-4 text-label',
        variant === 'primary'
          ? 'bg-olive text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-olive-hover'
          : 'border border-line bg-white text-ink hover:bg-black/[0.03]',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="cursor-pointer py-2 text-label text-olive underline-offset-4 hover:underline">
      {children}
    </button>
  )
}

/** One-of-many choice (Task / Event / Journal). */
export function Segmented<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex rounded-xl bg-fill p-1">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={o === value}
          onClick={() => onChange(o)}
          className={cx(
            'h-9 flex-1 cursor-pointer rounded-lg text-label transition-colors',
            o === value ? 'bg-olive text-white shadow-sm' : 'text-ink-2 hover:text-ink',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Category tag — tinted, so it doesn't read as a button. */
export function Tag({ children = 'Type' }: { children?: ReactNode }) {
  return <span className="inline-flex h-7 items-center rounded-full bg-olive-tint px-3 text-label text-olive">{children}</span>
}

function Fab({ to }: { to: ScreenId }) {
  const { go } = useNav()
  return (
    <button
      onClick={() => go(to)}
      aria-label="Add"
      className="absolute right-5 bottom-[calc(var(--spacing-safe-bottom)+12px)] z-10 flex size-14 cursor-pointer items-center justify-center rounded-2xl bg-rust text-white shadow-[0_6px_16px_rgba(187,101,40,0.35)] transition hover:brightness-105 active:scale-95"
    >
      <Plus />
    </button>
  )
}

export function Sprouts({
  count,
  total = count,
  onSelect,
  size = 'md',
}: {
  count: number
  total?: number
  onSelect?: (n: number) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const text = { sm: 'text-[16px]', md: 'text-[22px]', lg: 'text-[28px]' }[size]
  return (
    <div className={cx('flex gap-1 leading-none', text)} aria-label={`${count} of ${total} sprouts`}>
      {Array.from({ length: total }, (_, i) =>
        onSelect ? (
          <button
            key={i}
            onClick={() => onSelect(i + 1)}
            aria-label={`${i + 1} sprouts`}
            className={cx('cursor-pointer rounded-md transition hover:scale-110', i >= count && 'opacity-30 grayscale')}
          >
            🌱
          </button>
        ) : (
          <span key={i} className={cx(i >= count && 'opacity-30 grayscale')}>
            🌱
          </span>
        ),
      )}
    </div>
  )
}

/* ---------- Rows ---------- */

export function TaskRow({ name = 'Task 1', count = 2, onOpen }: { name?: string; count?: number; onOpen?: () => void }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex h-9 items-center gap-2.5">
      <button
        onClick={() => setDone((d) => !d)}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
        aria-pressed={done}
        className="-m-1.5 cursor-pointer rounded-full p-1.5"
      >
        <span
          className={cx(
            'flex size-[18px] items-center justify-center rounded-full border-[1.5px] text-white transition-colors',
            done ? 'border-olive bg-olive' : 'border-[#8a8a8a] hover:border-olive',
          )}
        >
          {done && <Check />}
        </span>
      </button>
      <button onClick={onOpen} className="flex min-w-0 flex-1 cursor-pointer items-center justify-between text-left text-label">
        <span className={cx('truncate', done ? 'text-muted line-through' : 'text-ink')}>{name}</span>
        <span className="font-medium text-muted tabular-nums">{count}</span>
      </button>
    </div>
  )
}

/** Events get a dot rather than a checkbox — they aren't something you tick off. */
export function EventRow({ name = 'Event', meta, onOpen }: { name?: string; meta?: string; onOpen?: () => void }) {
  return (
    <button onClick={onOpen} className="flex h-9 w-full cursor-pointer items-center gap-2.5 text-left">
      <span className="ml-[5px] size-2 shrink-0 rounded-full bg-olive/70" />
      <span className="ml-[3px] truncate text-label text-ink">{name}</span>
      {meta && <span className="ml-auto text-caption font-medium text-muted">{meta}</span>}
    </button>
  )
}

/* ---------- Form fields ---------- */

const inputBase =
  'w-full rounded-xl border border-line bg-white px-4 text-body text-ink outline-none transition placeholder:text-muted/70 focus:border-olive focus:ring-4 focus:ring-olive/15'

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx('flex flex-col gap-1.5', className)}>
      <span className="text-label text-ink">{label}</span>
      {children}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputBase, 'h-12', className)} />
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(inputBase, 'resize-none py-3', className)} />
}

/* ---------- Dialog ---------- */

export function UnsavedDialog({ onSave, onDiscard }: { onSave: () => void; onDiscard: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 p-8">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        className="w-full rounded-2xl bg-white p-6 text-center shadow-xl motion-safe:animate-dialog"
      >
        <h2 id="unsaved-title" className="text-section text-ink">
          You have unsaved changes
        </h2>
        <p className="mt-1 text-body text-muted">Would you like to save before leaving?</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" onClick={onDiscard}>
            Discard
          </Button>
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export const DETAILS_LONG =
  'Details Details Details Details Details Details Details Details Details Details Details Details Details Details Details Details Details'
