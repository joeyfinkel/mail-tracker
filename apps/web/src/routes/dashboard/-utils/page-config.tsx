import { activityConfig } from '../-resources/activity/config';
import { followUpsConfig } from '../-resources/follow-ups/config';
import { settingsConfig } from '../-resources/settings/config';
import { trackersConfig } from '../-resources/trackers/config';
import { createResourceConfig } from './layout';

export const dashboardPageConfig = createResourceConfig({
  ...activityConfig,
  ...followUpsConfig,
  ...trackersConfig,
  ...settingsConfig,
});
