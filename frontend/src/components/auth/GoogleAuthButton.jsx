import { useEffect, useId, useRef, useState } from 'react';

let googleScriptPromise;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export default function GoogleAuthButton({ label = 'continue_with', onCredential, disabled = false }) {
  const containerRef = useRef(null);
  const buttonId = useId().replace(/:/g, '');
  const [ready, setReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || disabled) {
      return undefined;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          text: label,
          shape: 'rectangular',
          width: 360,
        });
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      cancelled = true;
    };
  }, [clientId, disabled, label, onCredential]);

  if (!clientId) {
    return (
      <div className="p-3 rounded-lg border text-xs font-semibold" style={{ color: 'var(--clr-muted)', borderColor: 'var(--clr-border)', background: 'var(--clr-surface-cont)' }}>
        Set VITE_GOOGLE_CLIENT_ID to enable Google login.
      </div>
    );
  }

  return (
    <div className="google-auth-shell" aria-busy={!ready || disabled}>
      <div id={`google-auth-${buttonId}`} ref={containerRef} />
    </div>
  );
}
