import { AsyncLocalStorage } from 'node:async_hooks';

type RequestContextStore = {
  requestId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

export const RequestContext = {
  run<T>(store: RequestContextStore, fn: () => T): T {
    return asyncLocalStorage.run(store, fn);
  },

  getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  },
};
