import { ResourcePlaceholder } from '../../-components/resource-placeholder';
import { createResourceConfig, createResourceLayout } from '../../-utils/dashboard-layout';

const TrackersPage = createResourceLayout({
  resource: 'trackers',
  name: 'TrackersPage',
  title: 'Trackers',
  description: 'Review the tracking links and pixels attached to outgoing messages.',
});

export const trackersConfig = createResourceConfig.forResource('trackers', {
  component: (
    <TrackersPage>
      <ResourcePlaceholder />
    </TrackersPage>
  ),
});
