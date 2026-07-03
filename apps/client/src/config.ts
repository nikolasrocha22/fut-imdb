export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://footrateserver-production.up.railway.app' 
  : 'http://localhost:3001';

export function getApiUrl() {
  return `${API_BASE_URL}/api`;
}
