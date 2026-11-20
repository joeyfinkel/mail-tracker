import { ResourcePlaceholder } from '../../-components/resource-placeholder';
import { createResourceConfig, createResourceLayout } from '../../-utils/dashboard-layout';

const SettingsPage = createResourceLayout({
  resource: 'settings',
  name: 'SettingsPage',
  title: 'Settings',
  description: 'Manage connected Google accounts, browser extensions, and privacy preferences.',
});

export const settingsConfig = createResourceConfig.forResource('settings', {
  component: (
    <SettingsPage>
      <ResourcePlaceholder />
    </SettingsPage>
  ),
});
