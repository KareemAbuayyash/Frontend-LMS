import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../../utils/auth';

export default function ProfilePicture({ src, alt, className }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;
    (async () => {
      try {
        const token = getAccessToken();
        const res   = await fetch(src, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
        const blob = await res.blob();
        if (!cancelled) setBlobUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src]);

  if (!blobUrl) return <div className={className} style={{background:'#eee'}} />;

  return <img src={blobUrl} alt={alt} className={className} />;
}
