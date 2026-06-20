const API_BASE = 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return API_BASE + url;
  return url;
};
