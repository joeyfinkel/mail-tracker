import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Mail Tracker',
    description: 'Track email activity and view context without leaving Gmail.',
    permissions: ['storage'],
    host_permissions: ['https://mail.google.com/*', 'https://mail-tracker.localhost/*'],
    action: {
      default_title: 'Open Mail Tracker',
    },
    browser_specific_settings: {
      gecko: {
        id: 'mail-tracker@jfdevelops.com',
        strict_min_version: '140.0',
        data_collection_permissions: {
          required: ['personalCommunications', 'personallyIdentifyingInfo'],
        },
      },
    },
  },
});
