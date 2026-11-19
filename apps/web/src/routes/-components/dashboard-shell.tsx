import { Link } from '@tanstack/react-router';
import { Activity, AtSign, ChartNoAxesCombined, Inbox, MailCheck, Settings } from 'lucide-react';

import { dashboardNavigation } from '../-utils/dashboard-layout';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b bg-background md:min-h-screen md:border-r md:border-b-0">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <MailCheck aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="font-semibold leading-none">Mail Tracker</p>
            <p className="mt-1 text-xs text-muted-foreground">Personal workspace</p>
          </div>
        </div>

        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-1">
          {dashboardNavigation.flatMap((group) =>
            group.links.map((item) => {
              const Icon = navigationIcons[item.resource];
              const destination = item.resource === 'overview' ? '/dashboard' : `/dashboard/${item.resource}`;

              return (
                <Link
                  activeOptions={{ exact: item.resource === 'overview' }}
                  activeProps={{ className: 'bg-accent text-accent-foreground' }}
                  className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  key={item.resource}
                  to={destination}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              );
            }),
          )}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b bg-background px-5 lg:px-8">
          <div>
            <p className="text-sm font-medium">joey@example.com</p>
            <p className="text-xs text-muted-foreground">1 account connected</p>
          </div>
          <div
            aria-label="Google account"
            className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            J
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

const navigationIcons = {
  overview: ChartNoAxesCombined,
  activity: Activity,
  followUps: Inbox,
  trackers: AtSign,
  settings: Settings,
} as const;
