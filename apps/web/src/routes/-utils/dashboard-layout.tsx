import { defineResourceLayout } from '@jfdevelops/react-layout';
import { reactNode } from '@jfdevelops/react-layout-adapter-zod';

import { DashboardShell } from '../-components/dashboard-shell';

export const { createResourceLayout, createResourceLinks, Shell } = defineResourceLayout.withLayout({
  resources: ['overview', 'activity', 'followUps', 'trackers', 'settings'],
  options: {
    title: reactNode().optional(),
  },
  shell: {
    render: (_props, { children }) => <DashboardShell>{children}</DashboardShell>,
  },
  layout: {
    props: {
      custom: {
        children: reactNode(),
      },
    },
    render: ({ children }) => <>{children}</>,
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
