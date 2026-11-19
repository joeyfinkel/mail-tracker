import type { ExtensionRequest, ExtensionResponse, ExtensionSession } from '@/src/lib/messages';

const dashboardUrl = 'https://mail-tracker.localhost/';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (request: ExtensionRequest): Promise<ExtensionResponse> => {
    if (request.type === 'get-session') {
      const result = await browser.storage.local.get('session');
      const session = (result.session as ExtensionSession | undefined) ?? null;

      return { ok: true, session };
    }

    if (request.type === 'open-dashboard') {
      await browser.tabs.create({ url: dashboardUrl });

      return { ok: true };
    }

    const result = await browser.storage.local.get('session');
    const session = result.session as ExtensionSession | undefined;

    if (!session) {
      return { ok: false, error: 'Connect your Google account before creating a tracker.' };
    }

    const response = await fetch(new URL('/api/trackers', dashboardUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmails: request.recipientEmails,
        subject: request.subject,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: 'The tracker service is unavailable.' };
    }

    const tracker = (await response.json()) as { pixelUrl: string; trackerId: string };

    return { ok: true, tracker };
  });
});
