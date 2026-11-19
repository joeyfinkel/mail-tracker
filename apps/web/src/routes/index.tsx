import { createFileRoute } from '@tanstack/react-router';

import { LandingActions } from './-components/landing-actions';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <section className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Mail Tracker</h1>
          <p className="text-muted-foreground">Track email follow-ups and engagement across your accounts.</p>
        </div>

        <LandingActions />
      </section>
    </main>
  );
}
