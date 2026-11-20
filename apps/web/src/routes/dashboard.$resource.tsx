import { Navigate, createFileRoute } from '@tanstack/react-router';

import { createResourceLayout } from './-utils/dashboard-layout';

const resources = ['activity', 'followUps', 'trackers', 'settings'] as const;
type Resource = (typeof resources)[number];

export const Route = createFileRoute('/dashboard/$resource')({
  component: ResourcePage,
});

function ResourcePage() {
  const { resource } = Route.useParams();

  if (!isResource(resource)) {
    return <Navigate to="/dashboard" />;
  }

  return <ResourceContent resource={resource} />;
}

function ResourceContent({ resource }: { resource: Resource }) {
  const ResourceLayout = resourceLayouts[resource];

  return (
    <ResourceLayout>
      <div className="rounded-xl border border-dashed bg-background p-10 text-center">
        <p className="font-medium">This workspace is ready for live data.</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The dashboard foundation is in place; account data and interactions arrive with the backend integration.
        </p>
      </div>
    </ResourceLayout>
  );
}

function isResource(value: string): value is Resource {
  return resources.some((resource) => resource === value);
}

const resourceLayouts = {
  activity: createResourceLayout({
    resource: 'activity',
    name: 'ActivityPage',
    title: 'Activity',
    description: 'A chronological feed of opens, clicks, and replies across your connected accounts.',
  }),
  followUps: createResourceLayout({
    resource: 'followUps',
    name: 'FollowUpsPage',
    title: 'Follow-ups',
    description: 'Messages that need your attention, prioritized by timing and engagement.',
  }),
  trackers: createResourceLayout({
    resource: 'trackers',
    name: 'TrackersPage',
    title: 'Trackers',
    description: 'Review the tracking links and pixels attached to outgoing messages.',
  }),
  settings: createResourceLayout({
    resource: 'settings',
    name: 'SettingsPage',
    title: 'Settings',
    description: 'Manage connected Google accounts, browser extensions, and privacy preferences.',
  }),
} as const;
