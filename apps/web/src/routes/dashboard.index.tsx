import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, CheckCircle2, Clock3, Eye, MailOpen, MousePointerClick, Send } from 'lucide-react';

import { createResourceConfig, createResourceLayout } from './-utils/dashboard-layout';

export const Route = createFileRoute('/dashboard/')({
  component: OverviewRoute,
});

const OverviewLayout = createResourceLayout({
  resource: 'overview',
  name: 'OverviewPage',
  title: 'Your mail at a glance',
  description: 'A focused view of engagement across every connected inbox.',
});

export function OverviewPage() {
  return (
    <OverviewLayout>
      <DashboardOverview />
    </OverviewLayout>
  );
}

const overviewConfig = createResourceConfig.forResource('overview', {
  component: <OverviewPage />,
});

const overviewPageConfig = createResourceConfig({
  ...overviewConfig,
});

function OverviewRoute() {
  return overviewPageConfig.getComponent({ resource: 'overview' });
}

export function DashboardOverview() {
  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-primary">Thursday, November 19</p>
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">Demo data</span>
          Last synced <span className="font-medium text-foreground">2 min ago</span>
        </div>
      </section>

      <section aria-label="Mail performance" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Send} label="Tracked emails" trend="12%" value="48" />
        <MetricCard icon={Eye} label="Open rate" trend="5.2%" value="68%" />
        <MetricCard icon={MousePointerClick} label="Click rate" trend="2.1%" value="24%" />
        <MetricCard icon={Clock3} label="Avg. first open" trend="8 min faster" value="34m" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <section className="rounded-xl border bg-background">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Opens and clicks from the last 24 hours</p>
            </div>
            <a className="text-sm font-medium text-primary hover:underline" href="/dashboard/activity">
              View all
            </a>
          </div>
          <ul className="divide-y">
            {recentActivity.map((event) => (
              <li className="flex gap-4 p-5" key={`${event.person}-${event.time}`}>
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <MailOpen aria-hidden="true" className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{event.person}</span> {event.action}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{event.subject}</p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">{event.time}</time>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">Needs attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">Emails waiting on a follow-up</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">3 due</span>
            </div>
            <ul className="mt-5 space-y-4">
              {followUps.map((item) => (
                <li className="flex items-center gap-3" key={item.subject}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.subject}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.recipient}</p>
                  </div>
                  <span className="text-xs font-medium text-amber-700">{item.age}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border bg-background p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-600" />
              <div>
                <h2 className="font-semibold">Account healthy</h2>
                <p className="text-sm text-muted-foreground">Google sync is working normally</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium">joey@example.com</p>
                <p className="mt-1 text-xs text-muted-foreground">Connected with Google</p>
              </div>
              <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function MetricCard({ icon: Icon, label, trend, value }: { icon: typeof Send; label: string; trend: string; value: string }) {
  return (
    <article className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between">
        <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </div>
        <span className="text-xs font-medium text-emerald-700">{trend}</span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </article>
  );
}

const recentActivity = [
  { person: 'Maya Chen', action: 'opened your email', subject: 'Design partnership follow-up', time: '4m' },
  { person: 'Theo Martin', action: 'clicked a link', subject: 'Q4 planning notes and next steps', time: '18m' },
  { person: 'Ana Silva', action: 'opened your email', subject: 'Coffee next week?', time: '1h' },
  { person: 'Devon Brooks', action: 'reopened your email', subject: 'Product feedback request', time: '3h' },
] as const;

const followUps = [
  { subject: 'Contract details', recipient: 'Maya Chen', age: '3d' },
  { subject: 'Introduction to Priya', recipient: 'Theo Martin', age: '5d' },
  { subject: 'Project timeline', recipient: 'Ana Silva', age: '7d' },
] as const;
