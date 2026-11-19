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
  const content = resourceContent[resource];

  return (
    <ResourceLayout>
      <main className="p-5 lg:p-8">
        <p className="text-sm font-medium text-primary">Mail Tracker</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{content.description}</p>
        <div className="mt-8 rounded-xl border border-dashed bg-background p-10 text-center">
          <p className="font-medium">This workspace is ready for live data.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The dashboard foundation is in place; account data and interactions arrive with the backend integration.
          </p>
        </div>
      </main>
    </ResourceLayout>
  );
}

function isResource(value: string): value is Resource {
  return resources.some((resource) => resource === value);
}

const resourceContent = {
  activity: { title: 'Activity', description: 'A chronological feed of opens, clicks, and replies across your connected accounts.' },
  followUps: { title: 'Follow-ups', description: 'Messages that need your attention, prioritized by timing and engagement.' },
  trackers: { title: 'Trackers', description: 'Review the tracking links and pixels attached to outgoing messages.' },
  settings: { title: 'Settings', description: 'Manage connected Google accounts, browser extensions, and privacy preferences.' },
} as const;

const resourceLayouts = {
  activity: createResourceLayout({ resource: 'activity', name: 'ActivityPage' }),
  followUps: createResourceLayout({ resource: 'followUps', name: 'FollowUpsPage' }),
  trackers: createResourceLayout({ resource: 'trackers', name: 'TrackersPage' }),
  settings: createResourceLayout({ resource: 'settings', name: 'SettingsPage' }),
} as const;
