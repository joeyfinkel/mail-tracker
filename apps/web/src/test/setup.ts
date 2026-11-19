import { cleanup } from '@testing-library/react';

declare global {
  var __UI_SDK_STRICT__: boolean | undefined;
}

globalThis.__UI_SDK_STRICT__ = true;

afterEach(cleanup);
