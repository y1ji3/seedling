import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import PhoneFrame from './components/PhoneFrame'
import SideMenu from './components/SideMenu'
import { NavContext, SCREEN_NAMES, type ScreenId } from './nav'
import { Login, ResetPassword, Signup } from './screens/auth'
import { Home } from './screens/home'
import {
  Calendar,
  EditEntry,
  EditEvent,
  EditTask,
  EntryDetails,
  EventDetails,
  Journal,
  TaskDetails,
  TaskLists,
} from './screens/details'
import { Created, NewEvent, NewJournalEntry, NewTask, Saved } from './screens/create'

const SCREENS: Record<ScreenId, ComponentType> = {
  login: Login,
  signup: Signup,
  reset: ResetPassword,
  home: Home,
  tasks: TaskLists,
  taskDetails: TaskDetails,
  editTask: EditTask,
  calendar: Calendar,
  eventDetails: EventDetails,
  editEvent: EditEvent,
  journal: Journal,
  entryDetails: EntryDetails,
  editEntry: EditEntry,
  newTask: NewTask,
  newEvent: NewEvent,
  newJournal: NewJournalEntry,
  created: Created,
  saved: Saved,
}

const START: ScreenId = 'login'

// Deep link to any screen with a URL hash, e.g. /#calendar
const hash = window.location.hash.slice(1)
const INITIAL: ScreenId = hash in SCREENS ? (hash as ScreenId) : START

export default function App() {
  const [history, setHistory] = useState<ScreenId[]>([INITIAL])
  const current = history[history.length - 1]

  const [menuOpen, setMenuOpen] = useState(false)

  const go = useCallback((to: ScreenId) => setHistory((h) => [...h, to]), [])
  const back = useCallback(() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)), [])
  const reset = useCallback((to: ScreenId) => setHistory([to]), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const nav = useMemo(() => ({ current, go, back, reset, openMenu }), [current, go, back, reset, openMenu])

  // Mirror Figma presentation shortcuts: R restarts, ← goes back. Esc closes the menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setMenuOpen(false)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'r' || e.key === 'R') {
        setMenuOpen(false)
        setHistory([START])
      }
      if (e.key === 'ArrowLeft') {
        setMenuOpen(false)
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [back])

  const Current = SCREENS[current]

  return (
    <NavContext.Provider value={nav}>
      <PhoneFrame
        caption={
          <>
            <span className="text-white/70">{SCREEN_NAMES[current]}</span>
            <span className="mx-2">·</span>← back · R restart
          </>
        }
      >
        <Current key={history.length} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </PhoneFrame>
    </NavContext.Provider>
  )
}
