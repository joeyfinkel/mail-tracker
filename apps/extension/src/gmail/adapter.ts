type GmailComposeContext = {
  body: HTMLElement;
  recipientEmails: string[];
  subject?: string;
};

type GmailPageContext = {
  composeCount: number;
  threadId?: string;
};

function readEmail(element: Element) {
  return element.getAttribute('email') ?? element.getAttribute('data-hovercard-id');
}

export function findComposeContexts(root: ParentNode = document): GmailComposeContext[] {
  const dialogs = root.querySelectorAll<HTMLElement>('[role="dialog"]');

  return Array.from(dialogs).flatMap((dialog) => {
    const body = dialog.querySelector<HTMLElement>('[role="textbox"][contenteditable="true"]');

    if (!body) {
      return [];
    }

    const recipientEmails = Array.from(dialog.querySelectorAll('[email], [data-hovercard-id]'))
      .map(readEmail)
      .filter((email): email is string => Boolean(email));
    const subject = dialog.querySelector<HTMLInputElement>('input[name="subjectbox"]')?.value;

    return [{ body, recipientEmails: Array.from(new Set(recipientEmails)), subject }];
  });
}

export function insertTrackerPixel(compose: GmailComposeContext, pixelUrl: string) {
  const pixel = document.createElement('img');
  pixel.alt = '';
  pixel.dataset.mailTracker = 'true';
  pixel.height = 1;
  pixel.src = pixelUrl;
  pixel.width = 1;
  pixel.style.cssText = 'display:block;height:1px;width:1px;';
  compose.body.append(pixel);
  compose.body.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertHTML' }));
}

export function getGmailPageContext(root: ParentNode = document, locationHash = window.location.hash): GmailPageContext {
  const threadMatch = locationHash.match(/^#(?:inbox|all|sent|search\/[^/]+)\/([^/?#]+)/);

  return {
    composeCount: findComposeContexts(root).length,
    threadId: threadMatch?.[1],
  };
}
