import { ResourcePlaceholder } from '../../-components/resource-placeholder';
import { createResourceConfig, createResourceLayout } from '../../-utils/dashboard-layout';

const FollowUpsPage = createResourceLayout({
  resource: 'followUps',
  name: 'FollowUpsPage',
  title: 'Follow-ups',
  description: 'Messages that need your attention, prioritized by timing and engagement.',
});

export const followUpsConfig = createResourceConfig.forResource('followUps', {
  component: (
    <FollowUpsPage>
      <ResourcePlaceholder />
    </FollowUpsPage>
  ),
});
