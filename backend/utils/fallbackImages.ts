// frontend/src/utils/fallbackImages.ts

// ============================================================
// WEATHERVERSE — Fallback Images Utility
// ============================================================

// Create SVG fallback images as data URIs
export const createFallbackImage = (width: number = 400, height: number = 200) => {
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <rect x="10" y="10" width="${width-20}" height="${height-20}" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="${width/2}" y="${height/2 - 10}" font-family="Arial" font-size="${Math.min(width, height) / 12}" fill="#475569" text-anchor="middle">No Image</text>
  <text x="${width/2}" y="${height/2 + 30}" font-family="Arial" font-size="${Math.min(width, height) / 16}" fill="#334155" text-anchor="middle">📷</text>
</svg>
`)}`;
};

// Pre-defined fallback images
export const FALLBACK_IMAGE = createFallbackImage(800, 400);
export const FALLBACK_THUMB = createFallbackImage(400, 200);
export const FALLBACK_SMALL = createFallbackImage(100, 100);

// Helper function to handle image errors with retry
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.target as HTMLImageElement;
  
  // If already tried fallback, use the fallback
  if (img.dataset.fallbackUsed === 'true') {
    img.src = FALLBACK_IMAGE;
    return;
  }
  
  // Mark fallback as used
  img.dataset.fallbackUsed = 'true';
  
  // Try to fix the URL - ensure it's absolute
  let src = img.src;
  
  // If it's a relative path starting with /uploads, make it absolute
  if (src.startsWith('/uploads')) {
    img.src = `http://localhost:5000${src}`;
    return;
  }
  
  // If it's already an absolute path with localhost, try with full URL
  if (src.includes('localhost:5000/uploads')) {
    // Try adding a cache-busting parameter
    img.src = `${src}?t=${Date.now()}`;
    return;
  }
  
  // If all else fails, use fallback
  img.src = FALLBACK_IMAGE;
};

// Helper function to get image with fallback
export const getImageWithFallback = (url: string | null | undefined, fallback: string = FALLBACK_IMAGE) => {
  if (!url || url.trim() === '') {
    return fallback;
  }
  
  // If it's a relative path starting with /uploads, make it absolute
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  
  return url;
};

// Helper to validate if URL is accessible
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};