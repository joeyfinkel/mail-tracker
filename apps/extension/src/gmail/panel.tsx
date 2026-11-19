import { MailCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@mail-tracker/ui/button';
import { findComposeContexts, getGmailPageContext, insertTrackerPixel } from '@/src/gmail/adapter';
import { sendExtensionRequest } from '@/src/lib/runtime';

function GmailPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState(() => getGmailPageContext());
  const [status, setStatus] = useState<string>();
  const [isCreatingTracker, setIsCreatingTracker] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => setContext(getGmailPageContext()));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  function openDashboard() {
    void sendExtensionRequest({ type: 'open-dashboard' });
  }

  async function createTracker() {
    const compose = findComposeContexts().at(-1);

    if (!compose) {
      setStatus('Open a compose window first.');

      return;
    }

    if (compose.recipientEmails.length === 0) {
      setStatus('Add at least one recipient first.');

      return;
    }

    setIsCreatingTracker(true);
    setStatus(undefined);

    const response = await sendExtensionRequest({
      type: 'create-tracker',
      recipientEmails: compose.recipientEmails,
      subject: compose.subject,
    });

    if (!response.ok) {
      setStatus(response.error);
      setIsCreatingTracker(false);

      return;
    }

    if ('tracker' in response) {
      insertTrackerPixel(compose, response.tracker.pixelUrl);
      setStatus('Tracker inserted into your draft.');
    }

    setIsCreatingTracker(false);
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
        <Button onClick={() => void createTracker()} disabled={isCreatingTracker || context.composeCount === 0}>
          {isCreatingTracker ? 'Creating tracker…' : 'Insert tracker'}
        </Button>
        {status ? (
          <p className="gmail-panel__status" role="status">
            {status}
          </p>
        ) : null}
        <Button onClick={openDashboard} variant="outline">
          Open dashboard
        </Button>
      </div>
    </aside>
  );
}

export { GmailPanel };
