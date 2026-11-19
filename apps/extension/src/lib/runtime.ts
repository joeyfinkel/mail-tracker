import type { ExtensionRequest, ExtensionResponse } from './messages';

export async function sendExtensionRequest(request: ExtensionRequest) {
  const response = await browser.runtime.sendMessage<ExtensionRequest, ExtensionResponse>(request);

  return response;
}
