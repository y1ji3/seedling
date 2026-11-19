import type { ReactNode } from 'react'
import { useNav } from '../nav'
import { Button, Field, Input, Screen, TextLink } from '../components/ui'

function AuthLayout({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <Screen tone="canvas">
      <div className="flex min-h-full flex-col justify-center px-3 py-12">
        <h1 className="text-center text-display text-ink">{title}</h1>
        <div className="mt-8 flex flex-col gap-5">{children}</div>
        <div className="mt-6 flex items-center justify-center gap-1 text-label font-medium text-muted">{footer}</div>
      </div>
    </Screen>
  )
}

export function Login() {
  const { go } = useNav()
  return (
    <AuthLayout
      title="Login"
      footer={
        <>
          Don’t have an account?<TextLink onClick={() => go('signup')}>Sign up</TextLink>
        </>
      }
    >
      <Field label="Email">
        <Input type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <div className="flex flex-col">
        <Field label="Password">
          <Input type="password" autoComplete="current-password" />
        </Field>
        <div className="-mb-2 self-end">
          <TextLink onClick={() => go('reset')}>Forgot password?</TextLink>
        </div>
      </div>
      <Button onClick={() => go('home')}>Login</Button>
    </AuthLayout>
  )
}

export function Signup() {
  const { go } = useNav()
  return (
    <AuthLayout
      title="Sign Up"
      footer={
        <>
          Already have an account?<TextLink onClick={() => go('login')}>Log in</TextLink>
        </>
      }
    >
      <Field label="Email">
        <Input type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field label="Password">
        <Input type="password" autoComplete="new-password" />
      </Field>
      <Field label="Re-enter Password">
        <Input type="password" autoComplete="new-password" />
      </Field>
      <Button onClick={() => go('home')} className="mt-3">
        Sign Up
      </Button>
    </AuthLayout>
  )
}

export function ResetPassword() {
  const { go } = useNav()
  return (
    <AuthLayout
      title="Reset Password"
      footer={
        <>
          <TextLink onClick={() => go('login')}>Back to login</TextLink>
          <span aria-hidden className="px-1">·</span>
          <TextLink onClick={() => go('signup')}>Sign up</TextLink>
        </>
      }
    >
      <Field label="Email">
        <Input type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <div className="flex flex-col">
        <span className="mb-1.5 text-label text-ink">Verification Code</span>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Input key={i} maxLength={1} inputMode="numeric" aria-label={`Digit ${i + 1}`} className="!px-0 text-center text-section" />
          ))}
        </div>
        <div className="-mb-2 self-end">
          <TextLink>Resend code</TextLink>
        </div>
      </div>
      <Field label="Password">
        <Input type="password" autoComplete="current-password" />
      </Field>
      <Field label="New Password">
        <Input type="password" autoComplete="new-password" />
      </Field>
      <Button onClick={() => go('login')} className="mt-3">
        Reset Password
      </Button>
    </AuthLayout>
  )
}
