import { ResourcePlaceholder } from '../../-components/resource-placeholder';
import { createResourceConfig, createResourceLayout } from '../../-utils/dashboard-layout';

const ActivityPage = createResourceLayout({
  resource: 'activity',
  name: 'ActivityPage',
  title: 'Activity',
  description: 'A chronological feed of opens, clicks, and replies across your connected accounts.',
});

export const activityConfig = createResourceConfig.forResource('activity', {
  component: (
    <ActivityPage>
      <ResourcePlaceholder />
    </ActivityPage>
  ),
});
