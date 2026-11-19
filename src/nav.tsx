import { createContext, useContext } from 'react'

export type ScreenId =
  | 'login'
  | 'signup'
  | 'reset'
  | 'home'
  | 'tasks'
  | 'taskDetails'
  | 'editTask'
  | 'calendar'
  | 'eventDetails'
  | 'editEvent'
  | 'journal'
  | 'entryDetails'
  | 'editEntry'
  | 'newTask'
  | 'newEvent'
  | 'newJournal'
  | 'created'
  | 'saved'

export const SCREEN_NAMES: Record<ScreenId, string> = {
  login: 'Login',
  signup: 'Signup',
  reset: 'Reset Password',
  home: 'Home screen',
  tasks: 'Task Lists',
  taskDetails: 'Task Details',
  editTask: 'Edit Task',
  calendar: 'Calendar',
  eventDetails: 'Event Details',
  editEvent: 'Edit Event',
  journal: 'Journal',
  entryDetails: 'Entry Details',
  editEntry: 'Edit Entry',
  newTask: 'New Task',
  newEvent: 'New Event',
  newJournal: 'Check-In',
  created: 'Created',
  saved: 'Saved Changes',
}

type Nav = {
  current: ScreenId
  go: (to: ScreenId) => void
  back: () => void
  /** Replace the whole history, e.g. on log out, so "back" can't return. */
  reset: (to: ScreenId) => void
  openMenu: () => void
}

export const NavContext = createContext<Nav | null>(null)

export function useNav() {
  const nav = useContext(NavContext)
  if (!nav) throw new Error('useNav must be used inside NavContext')
  return nav
}
