import { useEffect, useRef, type ReactNode } from 'react'
import { useNav, type ScreenId } from '../nav'
import { CloseButton, cx } from './ui'
import seedPacket from '../assets/seed-packet.png'

const icon = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', className: 'size-5' } as const
const Icons = {
  home: <svg {...icon}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>,
  tasks: <svg {...icon}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.5 2.5L16 9.5" /></svg>,
  calendar: <svg {...icon}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  journal: <svg {...icon}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6" /></svg>,
  plus: <svg {...icon}><path d="M12 5v14M5 12h14" /></svg>,
  logout: <svg {...icon}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" /></svg>,
}

type Section = 'home' | 'tasks' | 'calendar' | 'journal'

const SECTIONS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: Icons.home },
  { id: 'tasks', label: 'Tasks', icon: Icons.tasks },
  { id: 'calendar', label: 'Calendar', icon: Icons.calendar },
  { id: 'journal', label: 'Journal', icon: Icons.journal },
]

const CREATE: { to: ScreenId; label: string }[] = [
  { to: 'newTask', label: 'New Task' },
  { to: 'newEvent', label: 'New Event' },
  { to: 'newJournal', label: 'New Journal Entry' },
]

/** Which top-level section a screen belongs to, for highlighting. */
const SECTION_OF: Partial<Record<ScreenId, Section>> = {
  home: 'home',
  tasks: 'tasks',
  taskDetails: 'tasks',
  editTask: 'tasks',
  calendar: 'calendar',
  eventDetails: 'calendar',
  editEvent: 'calendar',
  journal: 'journal',
  entryDetails: 'journal',
  editEntry: 'journal',
}

function MenuItem({ children, icon, active, onClick }: { children: ReactNode; icon: ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold transition-colors',
        active ? 'bg-olive-tint text-olive' : 'text-ink hover:bg-black/5',
      )}
    >
      <span className={active ? 'text-olive' : 'text-muted'}>{icon}</span>
      {children}
    </button>
  )
}

export default function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { current, go, reset } = useNav()
  const panel = useRef<HTMLDivElement>(null)
  const active = SECTION_OF[current]

  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLButtonElement>('[aria-current], button')?.focus()
  }, [open])

  const navigate = (to: ScreenId) => {
    onClose()
    if (to !== current) go(to)
  }

  return (
    // `invisible` (delayed by the transition) also removes the closed menu from the tab order.
    <div className={cx('absolute inset-0 z-30 transition-all duration-200', open ? 'visible' : 'invisible')}>
      <div
        onClick={onClose}
        className={cx('absolute inset-0 bg-black/35 transition-opacity duration-200', open ? 'opacity-100' : 'opacity-0')}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cx(
          'absolute inset-y-0 right-0 flex w-[296px] flex-col bg-white pt-safe-top pr-4 pb-[calc(var(--spacing-safe-bottom)+8px)] pl-5 shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="-mr-1 flex h-11 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={seedPacket} alt="" className="size-7" />
            <span className="text-[20px] font-bold italic tracking-tight text-olive">Seedling</span>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <nav className="mt-6 -ml-3 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <MenuItem key={s.id} icon={s.icon} active={active === s.id} onClick={() => navigate(s.id)}>
              {s.label}
            </MenuItem>
          ))}
        </nav>

        <p className="mt-8 mb-1 text-caption tracking-wide text-muted uppercase">Create</p>
        <div className="-ml-3 flex flex-col gap-1">
          {CREATE.map((c) => (
            <MenuItem key={c.to} icon={Icons.plus} onClick={() => navigate(c.to)}>
              {c.label}
            </MenuItem>
          ))}
        </div>

        <div className="mt-auto -ml-3 border-t border-line-soft pt-3">
          <MenuItem
            icon={Icons.logout}
            onClick={() => {
              onClose()
              reset('login')
            }}
          >
            Log out
          </MenuItem>
        </div>
      </div>
    </div>
  )
}
