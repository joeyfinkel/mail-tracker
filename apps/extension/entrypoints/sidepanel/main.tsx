import React from 'react';
import ReactDOM from 'react-dom/client';

import { ExtensionPanel } from '@/src/components/extension-panel';
import '@/src/styles/base.css';
import '@/src/styles/panel.css';

const rootElement = document.querySelector('#root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ExtensionPanel />
    </React.StrictMode>,
  );
}
