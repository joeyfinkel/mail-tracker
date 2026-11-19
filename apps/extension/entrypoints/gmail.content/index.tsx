import React from 'react';
import ReactDOM from 'react-dom/client';

import { GmailPanel } from '@/src/gmail/panel';
import '@/src/styles/base.css';
import './style.css';

export default defineContentScript({
  matches: ['https://mail.google.com/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'mail-tracker-gmail',
      position: 'inline',
      anchor: 'body',
      isolateEvents: true,
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        root.render(
          <React.StrictMode>
            <GmailPanel />
          </React.StrictMode>,
        );

        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
