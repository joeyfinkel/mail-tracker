import { defineResourceLayout } from '@jfdevelops/react-layout';
import { reactNode } from '@jfdevelops/react-layout-adapter-zod';
import { Link } from '@tanstack/react-router';
import { Activity, AtSign, ChartNoAxesCombined, Inbox, MailCheck, Settings } from 'lucide-react';

import {
  DashboardContent,
  DashboardHeader,
  DashboardLayout,
  DashboardResourceHeading,
  DashboardResourceLayout,
  DashboardSidebar,
} from '../-components/layout';

export const { createResourceConfig, createResourceLayout, createResourceLinks, resources, Shell } = defineResourceLayout.withLayout({
  resources: ['overview', 'activity', 'followUps', 'trackers', 'settings'],
  options: {
    title: reactNode(),
    description: reactNode().optional(),
  },
  shell: {
    composables: (create) => ({
      Layout: create({
        name: ({ capitalize, resource }) => (resource ? `${capitalize(resource)}Shell` : 'DashboardShell'),
        wrapWith: DashboardLayout,
      }),
      Sidebar: create({
        name: ({ capitalize, resource }) => (resource ? `${capitalize(resource)}Sidebar` : 'DashboardSidebar'),
        wrapWith: DashboardSidebar,
      }),
      Header: create({
        name: ({ capitalize, resource }) => (resource ? `${capitalize(resource)}Header` : 'DashboardHeader'),
        wrapWith: DashboardHeader,
      }),
      Content: create({
        name: ({ capitalize, resource }) => (resource ? `${capitalize(resource)}Content` : 'DashboardContent'),
        wrapWith: DashboardContent,
      }),
    }),
    render: (_props, { children, composables }) => (
      <composables.Layout>
        <composables.Sidebar>
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
        </composables.Sidebar>

        <composables.Content>
          <composables.Header>
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
          </composables.Header>
          {children}
        </composables.Content>
      </composables.Layout>
    ),
  },
  layout: {
    props: {
      include: {
        title: true,
        description: 'optional',
      },
    },
    composables: (create) => ({
      ResourceLayout: create({
        name: ({ capitalize, resource }) => `${capitalize(resource)}ResourceLayout`,
        wrapWith: DashboardResourceLayout,
      }),
      ResourceHeading: create({
        name: ({ capitalize, resource }) => `${capitalize(resource)}ResourceHeading`,
        wrapWith: DashboardResourceHeading,
      }),
    }),
    render: ({ children, description, title }, { composables }) => (
      <composables.ResourceLayout>
        <composables.ResourceHeading>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p> : null}
        </composables.ResourceHeading>
        {children}
      </composables.ResourceLayout>
    ),
  },
});

export const dashboardNavigation = createResourceLinks.withGroups([
  {
    links: {
      overview: { label: 'Overview', href: '/dashboard' },
      activity: { label: 'Activity' },
      followUps: { label: 'Follow-ups' },
      trackers: { label: 'Trackers' },
    },
  },
  {
    label: 'Workspace',
    links: {
      settings: { label: 'Settings' },
    },
  },
]);

const navigationIcons = {
  overview: ChartNoAxesCombined,
  activity: Activity,
  followUps: Inbox,
  trackers: AtSign,
  settings: Settings,
} as const;
