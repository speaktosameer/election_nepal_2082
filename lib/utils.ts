export function decodeQueryParams<T extends Record<string, any>>(params: T): T {
  if (!params) return params;
  const out: Record<string, any> = { ...params };
  for (const key of Object.keys(out)) {
    const v = out[key];
    if (typeof v === 'string') {
      try {
        out[key] = decodeURIComponent(v.replace(/\+/g, ' '));
      } catch (e) {
        out[key] = v.replace(/\+/g, ' ');
      }
    }
  }
  return out as T;
}
