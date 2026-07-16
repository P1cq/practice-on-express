// Defense-in-depth guard for building href/src attributes out of backend-provided
// paths (attachments, profile images). Rejects javascript:/data:/vbscript: schemes;
// relative paths and http(s) URLs pass through unchanged.
export function safeUrl(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
  return trimmed;
}
