import { useState, useEffect } from 'react'
import { TURNSTILE_SITE_KEY } from "astro:env/client"
import '@/types/turnstile'

export interface TurnstileWidgetProps {
  setValidVerification: (valid: boolean) => void;
  setExpired: (expired: boolean) => void;
  className?: string;
}

export function TurnstileWidgetIsland({ setValidVerification, setExpired, className = '' }: TurnstileWidgetProps) {
  const [turnstileWidget, setTurnstileWidget] = useState<number>();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const checkTurnstile = () => {
      if (window.turnstile) {
        setScriptLoaded(true);
        return;
      }
      setTimeout(checkTurnstile, 100);
    };
    checkTurnstile();
  }, []);

  useEffect(() => {
    if (scriptLoaded && !turnstileWidget && window.turnstile) {
      const widgetId = window.turnstile.render('.cf-turnstile', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: handleTurnstileVerify,
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
  }, [scriptLoaded]);

  const handleTurnstileVerify = async (token: string) => {
    try {
      const response = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setValidVerification(true);
        setExpired(false);
      } else {
        setValidVerification(false);
      }
    } catch (error) {
      console.error("Turnstile verification error:", error);
      setValidVerification(false);
    }
  };
  
  return (
    <div 
      className={`cf-turnstile flex justify-center ${className}`}
      data-sitekey={TURNSTILE_SITE_KEY}
    />
  );
}