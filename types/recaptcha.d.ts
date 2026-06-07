export {};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => number;
      getResponse: (id: number) => string;
      reset: (id: number) => void;
    };
  }
}
