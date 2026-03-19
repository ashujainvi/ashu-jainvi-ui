const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
const STORAGE_KEY = 'utm_params';

/** Store UTM params from the landing URL in sessionStorage so they persist across SPA navigations. */
export function captureUtmParams(search: string) {
  const params = new URLSearchParams(search);
  const hasUtm = UTM_KEYS.some((key) => params.has(key));
  if (!hasUtm) return;

  const utmData: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) utmData[key] = value;
  });
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
}

/** Retrieve stored UTM params for the current session. */
export function getStoredUtmParams(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
