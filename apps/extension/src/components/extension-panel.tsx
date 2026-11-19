import { ExternalLink, MailCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/src/components/ui/button';
import type { ExtensionSession } from '@/src/lib/messages';
import { sendExtensionRequest } from '@/src/lib/runtime';
import { cn } from '@/src/lib/utils';

type ExtensionPanelProps = {
  compact?: boolean;
};

function ExtensionPanel({ compact = false }: ExtensionPanelProps) {
  const [session, setSession] = useState<ExtensionSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void sendExtensionRequest({ type: 'get-session' }).then((response) => {
      if (response.ok && 'session' in response) {
        setSession(response.session);
      }

      setIsLoading(false);
    });
  }, []);

  function openDashboard() {
    void sendExtensionRequest({ type: 'open-dashboard' });
  }

  return (
    <main className={cn('panel', compact && 'panel--compact')}>
      <header className="panel__header">
        <span className="panel__mark" aria-hidden="true">
          <MailCheck size={18} />
        </span>
        <div>
          <strong>Mail Tracker</strong>
          <p>{session?.accountEmail ?? 'Not connected'}</p>
        </div>
      </header>

      <section className="panel__content" aria-live="polite">
        <span className="status-dot" data-connected={Boolean(session)} />
        <div>
          <strong>{isLoading ? 'Checking connection…' : session ? 'Connected' : 'Connect your account'}</strong>
          <p>
            {session
              ? 'Open Gmail to add trackers and see conversation context.'
              : 'Continue with Google in the web app to activate the extension.'}
          </p>
        </div>
      </section>

      <Button onClick={openDashboard}>
        {session ? 'Open dashboard' : 'Continue with Google'}
        <ExternalLink size={15} />
      </Button>
    </main>
  );
}

export { ExtensionPanel };
