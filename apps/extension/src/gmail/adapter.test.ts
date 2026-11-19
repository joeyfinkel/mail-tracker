import { describe, expect, it } from 'vitest';

import { findComposeContexts, getGmailPageContext } from './adapter';

describe('Gmail adapter', () => {
  it('extracts compose metadata from a Gmail fixture', () => {
    document.body.innerHTML = `
      <div role="dialog">
        <span email="person@example.com"></span>
        <input name="subjectbox" value="Quarterly update" />
        <div role="textbox" contenteditable="true">Hello</div>
      </div>
    `;

    expect(findComposeContexts()).toMatchObject([
      {
        recipientEmails: ['person@example.com'],
        subject: 'Quarterly update',
      },
    ]);
  });

  it('returns safe empty context when Gmail markup changes', () => {
    document.body.innerHTML = '<main>Unknown Gmail markup</main>';

    expect(getGmailPageContext(document, '#inbox')).toEqual({
      composeCount: 0,
      threadId: undefined,
    });
  });

  it('reads a thread identifier from a Gmail route', () => {
    document.body.innerHTML = '';

    expect(getGmailPageContext(document, '#inbox/FMfcgzQZSabc123').threadId).toBe('FMfcgzQZSabc123');
  });
});
