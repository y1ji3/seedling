import { useState, type ReactNode } from 'react'
import { useNav, type ScreenId } from '../nav'
import {
  AppHeader,
  Button,
  Card,
  CloseButton,
  DETAILS_LONG,
  EditButton,
  EventRow,
  Field,
  Group,
  Input,
  MenuButton,
  PageTitle,
  Screen,
  SectionHeader,
  Sprouts,
  SubBar,
  Tag,
  TaskRow,
  TextArea,
  UnsavedDialog,
} from '../components/ui'

/* ---------- shared bits ---------- */

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-caption tracking-wide text-muted uppercase">{label}</h3>
      <p className="mt-1 text-body text-ink">{children}</p>
    </div>
  )
}

/** Read-only "Details" sections shared by Task / Event / Entry detail screens. */
function DetailSections({ short = false }: { short?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <DetailBlock label="Details">{short ? 'Details Details Details Details Details Details Details Details' : DETAILS_LONG}</DetailBlock>
      {!short && <DetailBlock label="Details">{DETAILS_LONG}</DetailBlock>}
      <div className="grid grid-cols-2 gap-4">
        <DetailBlock label="Details">Details Details</DetailBlock>
        <DetailBlock label="Details">{short ? 'Details Details' : 'Details Details Details Details'}</DetailBlock>
      </div>
    </div>
  )
}

/** Editable versions of the same sections. */
function DetailFields() {
  return (
    <>
      <Field label="Details">
        <TextArea rows={3} defaultValue={DETAILS_LONG} />
      </Field>
      <Field label="Details">
        <TextArea rows={3} defaultValue={DETAILS_LONG} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Details">
          <Input defaultValue="Details Details" />
        </Field>
        <Field label="Details">
          <Input defaultValue="Details Details" />
        </Field>
      </div>
    </>
  )
}

/** Two-up summary strip under a detail title (Sprouts / Category, When / Category). */
function MetaStrip({ left, right }: { left: [string, ReactNode]; right: [string, ReactNode] }) {
  return (
    <div className="mt-5 grid grid-cols-2 divide-x divide-line-soft rounded-2xl border border-line-soft">
      {[left, right].map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1.5 px-4 py-3">
          <span className="text-caption tracking-wide text-muted uppercase">{label}</span>
          <div className="flex min-h-7 items-center">{value}</div>
        </div>
      ))}
    </div>
  )
}

function DetailTop({ back, backTo, onEdit }: { back: string; backTo: ScreenId; onEdit: () => void }) {
  const { go } = useNav()
  return (
    <SubBar
      back={back}
      onBack={() => go(backTo)}
      action={
        <div className="-mr-1 flex">
          <EditButton onClick={onEdit} />
          <MenuButton />
        </div>
      }
    />
  )
}

/** Edit screens ask before leaving with unsaved changes. */
function useUnsavedGuard(leaveTo: ScreenId) {
  const { go } = useNav()
  const [open, setOpen] = useState(false)
  return {
    ask: () => setOpen(true),
    dialog: open ? <UnsavedDialog onSave={() => go('saved')} onDiscard={() => go(leaveTo)} /> : null,
  }
}

function EditTop({ back, onLeave }: { back: string; onLeave: () => void }) {
  return <SubBar back={back} onBack={onLeave} action={<CloseButton onClick={onLeave} />} />
}

/* ---------- Tasks ---------- */

export function TaskLists() {
  const { go } = useNav()
  const open = () => go('taskDetails')
  const groups: [string, number][] = [
    ['Today', 4],
    ['Tomorrow', 4],
    ['Week', 3],
  ]
  return (
    <Screen top={<AppHeader />} fab="newTask">
      <PageTitle className="mt-2">Tasks</PageTitle>

      <section className="mt-4">
        <SectionHeader title="Priorities" />
        <Card variant="outline" className="py-2">
          {Array.from({ length: 6 }, (_, i) => <TaskRow key={i} onOpen={open} />)}
        </Card>
      </section>

      <section className="mt-6">
        <SectionHeader title="Tasks" action="All tasks" />
        <Card className="flex flex-col gap-4">
          {groups.map(([label, n]) => (
            <Group key={label} label={label}>
              {Array.from({ length: n }, (_, i) => <TaskRow key={i} onOpen={open} />)}
            </Group>
          ))}
        </Card>
      </section>
    </Screen>
  )
}

export function TaskDetails() {
  const { go } = useNav()
  return (
    <Screen top={<DetailTop back="All Tasks" backTo="tasks" onEdit={() => go('editTask')} />}>
      <div className="mt-2 flex items-baseline justify-between gap-4">
        <PageTitle>Title</PageTitle>
        <span className="text-label text-muted">Date</span>
      </div>
      <MetaStrip left={['Sprouts', <Sprouts count={3} />]} right={['Category', <Tag />]} />
      <DetailSections />
    </Screen>
  )
}

export function EditTask() {
  const { go } = useNav()
  const { ask, dialog } = useUnsavedGuard('taskDetails')
  const [sprouts, setSprouts] = useState(3)
  return (
    <Screen
      top={<EditTop back="All Tasks" onLeave={ask} />}
      bottom={<Button onClick={() => go('saved')}>Done</Button>}
      overlay={dialog}
    >
      <div className="mt-2 flex flex-col gap-5">
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label="Title">
            <Input defaultValue="Title" />
          </Field>
          <Field label="Date">
            <Input placeholder="Date" />
          </Field>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-label text-ink">Sprouts</span>
            <Sprouts count={sprouts} total={5} onSelect={setSprouts} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-label text-ink">Category</span>
            <Tag />
          </div>
        </div>
        <DetailFields />
      </div>
    </Screen>
  )
}

/* ---------- Events ---------- */

export function Calendar() {
  const { go } = useNav()
  const open = () => go('eventDetails')
  return (
    <Screen top={<AppHeader />} fab="newEvent">
      <PageTitle className="mt-2">Calendar</PageTitle>

      <section className="mt-4">
        <SectionHeader title="Today’s Events" action="Details" />
        <Card variant="outline" className="py-2">
          {Array.from({ length: 6 }, (_, i) => <EventRow key={i} meta="more details" onOpen={open} />)}
        </Card>
      </section>

      <section className="mt-6">
        <SectionHeader title="All Events" action="Past events" />
        <Card className="flex flex-col gap-5">
          {[6, 4, 6].map((n, g) => (
            <div key={g}>
              <div className="flex items-baseline justify-between">
                <p className="text-label text-ink">Date --</p>
                <p className="text-caption text-muted">Additional info</p>
              </div>
              {Array.from({ length: n }, (_, i) => <EventRow key={i} meta="more details" onOpen={open} />)}
            </div>
          ))}
        </Card>
      </section>
    </Screen>
  )
}

export function EventDetails() {
  const { go } = useNav()
  return (
    <Screen top={<DetailTop back="All Events" backTo="calendar" onEdit={() => go('editEvent')} />}>
      <PageTitle className="mt-2">Title</PageTitle>
      <p className="mt-1 text-label font-medium text-muted">Location</p>
      <MetaStrip
        left={['When', <span className="text-label text-ink">Date · Time</span>]}
        right={['Category', <Tag />]}
      />
      <DetailSections />
    </Screen>
  )
}

export function EditEvent() {
  const { go } = useNav()
  const { ask, dialog } = useUnsavedGuard('eventDetails')
  return (
    <Screen
      top={<EditTop back="All Events" onLeave={ask} />}
      bottom={<Button onClick={() => go('saved')}>Done</Button>}
      overlay={dialog}
    >
      <div className="mt-2 flex flex-col gap-5">
        <Field label="Title">
          <Input defaultValue="Title" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <Input placeholder="Date" />
          </Field>
          <Field label="Time">
            <Input placeholder="Time" />
          </Field>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <Field label="Location">
            <Input placeholder="Location" />
          </Field>
          <div className="flex flex-col gap-1.5">
            <span className="text-label text-ink">Category</span>
            <div className="flex h-12 items-center">
              <Tag />
            </div>
          </div>
        </div>
        <DetailFields />
      </div>
    </Screen>
  )
}

/* ---------- Journal ---------- */

const SUMMARY =
  'summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary summary.....'

export function Journal() {
  const { go } = useNav()
  return (
    <Screen top={<AppHeader />} fab="newJournal">
      <PageTitle className="mt-2">Journal</PageTitle>
      <div className="mt-4 flex flex-col gap-3">
        {[2, 4, 3].map((sprouts, i) => (
          <button
            key={i}
            onClick={() => go('entryDetails')}
            className="cursor-pointer rounded-2xl border border-line-soft bg-white p-4 text-left transition-colors hover:border-line active:bg-black/[0.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-label text-ink">Date</p>
              <Sprouts count={sprouts} size="sm" />
            </div>
            <p className="mt-2 line-clamp-4 text-label font-medium text-ink-2">{SUMMARY}</p>
          </button>
        ))}
      </div>
    </Screen>
  )
}

const ENTRY_TEXT = Array(45).fill('Text').join(' ')

export function EntryDetails() {
  const { go } = useNav()
  return (
    <Screen top={<DetailTop back="Journal" backTo="journal" onEdit={() => go('editEntry')} />}>
      <PageTitle className="mt-2">date</PageTitle>
      <MetaStrip left={['Sprouts', <Sprouts count={3} />]} right={['Category', <Tag>Journal</Tag>]} />
      <p className="mt-6 text-body text-ink">{ENTRY_TEXT}</p>
      <DetailSections short />
    </Screen>
  )
}

export function EditEntry() {
  const { go } = useNav()
  const { ask, dialog } = useUnsavedGuard('entryDetails')
  const [sprouts, setSprouts] = useState(3)
  return (
    <Screen
      top={<EditTop back="Journal" onLeave={ask} />}
      bottom={<Button onClick={() => go('saved')}>Complete</Button>}
      overlay={dialog}
    >
      <div className="mt-2 flex flex-col gap-5">
        <PageTitle>date</PageTitle>
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-ink">Sprouts</span>
          <Sprouts count={sprouts} total={5} onSelect={setSprouts} />
        </div>
        <Field label="Entry">
          <TextArea rows={6} defaultValue={ENTRY_TEXT} />
        </Field>
        <Field label="Details">
          <TextArea rows={2} defaultValue="Details Details Details Details Details Details Details Details Details Details Details Details" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Details">
            <Input defaultValue="Details Details" />
          </Field>
          <Field label="Details">
            <Input defaultValue="Details Details" />
          </Field>
        </div>
      </div>
    </Screen>
  )
}
