// frontend/src/utils/fallbackImages.ts

// Get the API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create SVG fallback
export const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#0f172a"/>
  <rect x="10" y="10" width="780" height="380" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="400" y="195" font-family="Arial" font-size="28" fill="#475569" text-anchor="middle">No Image</text>
  <text x="400" y="240" font-family="Arial" font-size="20" fill="#334155" text-anchor="middle">📷</text>
</svg>
`)}`;

export const FALLBACK_SMALL = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0f172a"/>
  <rect x="5" y="5" width="90" height="90" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="50" y="52" font-family="Arial" font-size="12" fill="#475569" text-anchor="middle">No Image</text>
</svg>
`)}`;

// ✅ FIX: Fix image URL to work across origins
export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return FALLBACK_IMAGE;
  }

  // If it's a relative path starting with /uploads
  if (url.startsWith('/uploads')) {
    return `${API_BASE}${url}`;
  }

  // If it's a localhost URL without protocol
  if (url.startsWith('localhost:5000/uploads')) {
    return `http://${url}`;
  }

  // If it already has http/https, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return url;
};

// ✅ FIX: Handle image errors with retry
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.target as HTMLImageElement;
  
  // If already tried fallback, use the fallback
  if (img.dataset.fallbackUsed === 'true') {
    img.src = FALLBACK_IMAGE;
    return;
  }
  
  // Mark fallback as used
  img.dataset.fallbackUsed = 'true';
  
  // Try to fix the URL
  try {
    const currentSrc = img.src;
    console.log('🔄 Image failed to load:', currentSrc);
    
    // If it contains localhost:5000/uploads, try with full URL
    if (currentSrc.includes('/uploads') && !currentSrc.includes('http')) {
      const fixed = fixImageUrl(currentSrc);
      console.log('🔄 Trying fixed URL:', fixed);
      img.src = fixed;
      return;
    }
    
    // If it's a localhost URL, try adding cache buster
    if (currentSrc.includes('localhost:5000')) {
      img.src = `${currentSrc}?t=${Date.now()}`;
      return;
    }
  } catch (error) {
    console.error('Image error handler:', error);
  }
  
  // If all else fails, use fallback
  img.src = FALLBACK_IMAGE;
};

// ✅ FIX: Get image with fallback
export const getImageWithFallback = (url: string | null | undefined, fallback: string = FALLBACK_IMAGE) => {
  if (!url || url.trim() === '') {
    return fallback;
  }
  return fixImageUrl(url);
};