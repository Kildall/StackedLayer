import { useState, useEffect } from 'react'
import { TURNSTILE_SITE_KEY } from "astro:env/client"
import '@/types/turnstile'

export interface TurnstileWidgetProps {
  setToken: (token: string) => void;
  setExpired: (expired: boolean) => void;
  className?: string;
}

export function TurnstileWidgetIsland({ setToken, setExpired, className = '' }: TurnstileWidgetProps) {
  const [turnstileWidget, setTurnstileWidget] = useState<number>();
  useEffect(() => {
    if (!turnstileWidget && window.turnstile) {
      const widgetId = window.turnstile.render('#turnstile-widget', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setToken(token),
        'refresh-expired': 'manual',
        'expired-callback': () => setExpired(true),
      });
      setTurnstileWidget(widgetId);
    }

    return () => {
      if (turnstileWidget && window.turnstile) {
          window.turnstile.remove(turnstileWidget);
        }
      };
  }, [window.turnstile]);
  
  return (
    <div
      id="turnstile-widget"
      className={`flex justify-center ${className}`}
    />
  );
}