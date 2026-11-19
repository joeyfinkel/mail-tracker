export type ExtensionSession = {
  accountEmail: string;
  accessToken: string;
};

export type TrackerArtifact = {
  html: string;
  trackerId: string;
};

export type ExtensionRequest =
  | { type: 'get-session' }
  | { type: 'open-dashboard' }
  | { type: 'create-tracker'; recipientEmails: string[]; subject?: string };

export type ExtensionResponse =
  | { ok: true; session: ExtensionSession | null }
  | { ok: true; tracker: TrackerArtifact }
  | { ok: true }
  | { ok: false; error: string };
