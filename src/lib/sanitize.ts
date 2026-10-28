/**
 * Security & Sanitization Utilities
 * Implements strict string sanitization against XSS, HTML Injection and script payloads.
 */

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 2000); // Enforce reasonable length boundary
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key];
    if (typeof val === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(val);
    } else if (Array.isArray(val)) {
      (sanitized as Record<string, unknown>)[key] = val.map(item =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    }
  }
  return sanitized;
}
