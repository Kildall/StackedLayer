export type Turnstile = {
  render: (element: string, options: { sitekey: string, callback: (token: string) => void, 'expired-callback': () => void, 'refresh-expired': 'manual' }) => number;
  remove: (widgetId: number) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}