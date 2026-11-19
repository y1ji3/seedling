import { useNav } from '../nav'
import { AppHeader, Button, Card, EventRow, Group, PageTitle, Screen, SectionHeader, Sprouts, TaskRow } from '../components/ui'

function ProgressRing({ value, size = 104 }: { value: number; size?: number }) {
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line-soft)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-olive)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-title text-ink tabular-nums">{value}%</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-muted">{label}</p>
      <p className="text-title text-ink tabular-nums">{value}</p>
    </div>
  )
}

export function Home() {
  const { go } = useNav()
  const task = () => go('taskDetails')
  const event = () => go('eventDetails')

  return (
    <Screen tone="canvas" top={<AppHeader />} fab="newTask">
      <PageTitle className="mt-2">Home</PageTitle>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card variant="outline" className="flex flex-col justify-center gap-3">
          <Stat label="Other stat" value="70%" />
          <div className="h-px bg-line-soft" />
          <Stat label="This week" value="70%" />
        </Card>
        <Card className="flex flex-col items-center gap-2">
          <span className="self-start text-caption text-muted">Completed</span>
          <ProgressRing value={100} />
        </Card>
      </div>

      <section className="mt-6">
        <SectionHeader title="Journal" action="See all" onAction={() => go('journal')} />
        <Card className="flex items-center justify-between gap-3">
          <div>
            <p className="text-caption text-muted">Today’s sprouts</p>
            <div className="mt-1">
              <Sprouts count={3} />
            </div>
          </div>
          <Button size="sm" className="!w-auto" onClick={() => go('newJournal')}>
            New Journal Entry
          </Button>
        </Card>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <section>
          <SectionHeader title="Tasks" action="All" onAction={() => go('tasks')} />
          <Card className="flex flex-col gap-3 px-3 py-3">
            <Group label="Today">
              {[0, 1, 2, 3].map((i) => <TaskRow key={i} onOpen={task} />)}
            </Group>
            <Group label="Tomorrow">
              {[0, 1, 2].map((i) => <TaskRow key={i} onOpen={task} />)}
            </Group>
            <Group label="Week">
              {[0, 1].map((i) => <TaskRow key={i} onOpen={task} />)}
            </Group>
          </Card>
        </section>
        <section>
          <SectionHeader title="Events" action="All" onAction={() => go('calendar')} />
          <Card className="flex flex-col gap-3 px-3 py-3">
            <Group label="Today">
              {[0, 1, 2, 3, 4].map((i) => <EventRow key={i} onOpen={event} />)}
            </Group>
            <Group label="Tomorrow">
              {[0, 1, 2].map((i) => <EventRow key={i} onOpen={event} />)}
            </Group>
            <Group label="Week">
              <EventRow onOpen={event} />
            </Group>
          </Card>
        </section>
      </div>
    </Screen>
  )
}
