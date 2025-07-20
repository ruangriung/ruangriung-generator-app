'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  options?: {
    theme?: 'light' | 'dark' | 'auto';
  };
}

export default function TurnstileWidget({ onSuccess, options }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error("Turnstile site key is not configured.");
    return <div>Cannot load CAPTCHA.</div>;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      options={options}
    />
  );
}