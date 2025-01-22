import { useState, useEffect } from 'react'
import { TURNSTILE_SITE_KEY } from "astro:env/client"
import '@/types/turnstile'

export interface TurnstileWidgetProps {
  setValidVerification: (valid: boolean) => void;
  className?: string;
}

export function TurnstileWidgetIsland({ setValidVerification, className = '' }: TurnstileWidgetProps) {
  const [turnstileWidget, setTurnstileWidget] = useState<number>();

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
      } else {
        setValidVerification(false);
      }
    } catch (error) {
      console.error("Turnstile verification error:", error);
      setValidVerification(false);
    }
  };
  
  useEffect(() => {
    if (window.turnstile && !turnstileWidget) {
      const widgetId = window.turnstile.render('.cf-turnstile', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: handleTurnstileVerify,
      });
      setTurnstileWidget(widgetId);
    }
    
    return () => {
      if (turnstileWidget && window.turnstile) {
        window.turnstile.remove(turnstileWidget);
      }
    };
  }, []);

  return (
    <div 
      className={`cf-turnstile flex justify-center ${className}`}
      data-sitekey={TURNSTILE_SITE_KEY}
    />
  );
}