import { MailCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { getGmailPageContext } from '@/src/gmail/adapter';
import { sendExtensionRequest } from '@/src/lib/runtime';

function GmailPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState(() => getGmailPageContext());

  useEffect(() => {
    const observer = new MutationObserver(() => setContext(getGmailPageContext()));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  function openDashboard() {
    void sendExtensionRequest({ type: 'open-dashboard' });
  }

  if (!isOpen) {
    return (
      <Button className="gmail-trigger" size="icon" onClick={() => setIsOpen(true)} aria-label="Open Mail Tracker">
        <MailCheck size={18} />
      </Button>
    );
  }

  return (
    <aside className="gmail-panel" aria-label="Mail Tracker">
      <header>
        <span>
          <MailCheck size={17} />
          <strong>Mail Tracker</strong>
        </span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close Mail Tracker">
          <X size={16} />
        </Button>
      </header>
      <div className="gmail-panel__content">
        <p className="eyebrow">Gmail context</p>
        <strong>{context.threadId ? 'Conversation detected' : 'Open a conversation'}</strong>
        <p>
          {context.composeCount > 0
            ? `${context.composeCount} active compose window${context.composeCount === 1 ? '' : 's'}.`
            : 'Start a draft to insert a tracker.'}
        </p>
        <Button onClick={openDashboard} variant="outline">
          Open dashboard
        </Button>
      </div>
    </aside>
  );
}

export { GmailPanel };
