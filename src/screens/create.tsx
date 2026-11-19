import { useState, type ReactNode } from 'react'
import { useNav, type ScreenId } from '../nav'
import { Button, Check, CloseButton, Field, Input, PageTitle, Screen, Segmented, Sprouts, TextArea } from '../components/ui'

type Kind = 'Task' | 'Event' | 'Journal'
const KIND_SCREEN: Record<Kind, ScreenId> = { Task: 'newTask', Event: 'newEvent', Journal: 'newJournal' }
const KINDS = Object.keys(KIND_SCREEN) as Kind[]

/** Shared shell for the New Task / New Event / New Journal Entry sheets. */
function CreateSheet({
  title,
  subtitle,
  kind,
  action,
  children,
}: {
  title: string
  subtitle?: string
  kind: Kind
  action: string
  children: ReactNode
}) {
  const { go, back } = useNav()
  return (
    <Screen
      top={
        <div className="-mr-2 flex min-h-11 items-center justify-between">
          <div>
            <PageTitle>{title}</PageTitle>
            {subtitle && <p className="text-label font-medium text-muted">{subtitle}</p>}
          </div>
          <CloseButton onClick={back} />
        </div>
      }
      bottom={<Button onClick={() => go('created')}>{action}</Button>}
    >
      <div className="mt-3">
        <Segmented options={KINDS} value={kind} onChange={(k) => go(KIND_SCREEN[k])} />
      </div>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </Screen>
  )
}

export function NewTask() {
  return (
    <CreateSheet title="New Task" kind="Task" action="Submit">
      <Field label="Title">
        <Input placeholder="title" autoFocus />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Text">
          <Input placeholder="Text" />
        </Field>
        <Field label="Text">
          <Input placeholder="Text" />
        </Field>
      </div>
    </CreateSheet>
  )
}

export function NewEvent() {
  return (
    <CreateSheet title="New Event" kind="Event" action="Submit">
      <Field label="Title">
        <Input placeholder="title" autoFocus />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Text">
          <Input placeholder="Text" />
        </Field>
        <Field label="Date">
          <Input type="date" className="text-label" />
        </Field>
      </div>
    </CreateSheet>
  )
}

export function NewJournalEntry() {
  const [sprouts, setSprouts] = useState(3)
  return (
    <CreateSheet title="New Journal Entry" subtitle="date" kind="Journal" action="Complete">
      <div className="flex flex-col gap-1.5">
        <span className="text-label text-ink">Sprouts</span>
        <Sprouts count={sprouts} total={5} onSelect={setSprouts} size="lg" />
      </div>
      <Field label="Entry">
        <TextArea rows={6} placeholder="Text" />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
      <Field label="Text">
        <Input placeholder="Text" />
      </Field>
    </CreateSheet>
  )
}

/* ---------- Confirmation ---------- */

function Confirmation({ verb }: { verb: string }) {
  const { go } = useNav()
  return (
    <Screen
      top={
        <div className="-mr-2 flex h-11 justify-end">
          <CloseButton onClick={() => go('home')} />
        </div>
      }
      bottom={<Button onClick={() => go('home')}>Dismiss</Button>}
    >
      <div className="flex min-h-full flex-col items-center justify-center pb-12 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-olive-tint text-olive motion-safe:animate-dialog">
          <Check className="size-12" />
        </div>
        <h1 className="mt-6 text-title text-ink">Done</h1>
        <p className="mt-2 text-body text-muted">
          Your task event journal
          <br />
          was {verb}
        </p>
      </div>
    </Screen>
  )
}

export const Created = () => <Confirmation verb="created" />
export const Saved = () => <Confirmation verb="saved" />
