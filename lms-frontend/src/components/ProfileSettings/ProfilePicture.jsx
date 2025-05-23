import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../../utils/auth';

export default function ProfilePicture({ src, alt, className, username }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = getAccessToken();
        const res   = await fetch(src, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
        const blob = await res.blob();
        if (!cancelled) {
          setBlobUrl(URL.createObjectURL(blob));
          setError(false);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(true);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line
  }, [src]);

  if (error || !src) {
    // Fallback: colored circle with first letter
    return (
      <span className={className} style={{
        background: '#644191',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '1.1rem',
        borderRadius: '50%',
        width: '36px',
        height: '36px'
      }}>
        {username?.[0]?.toUpperCase() || '?'}
      </span>
    );
  }

  if (!blobUrl) return <div className={className} style={{background:'#eee'}} />;

  return <img src={blobUrl} alt={alt} className={className} onError={() => setError(true)} />;
}
