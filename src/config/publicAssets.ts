/** Resolve local public assets against the deployment base, including project Pages sites. */
export function publicUrl(path: string, base = import.meta.env?.BASE_URL ?? '/') {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = base === '/' ? '' : '/' + base.replace(/^\/+|\/+$/g, '');
  if (prefix && (path === prefix || path.startsWith(prefix + '/'))) return path;
  return prefix + path;
}

/** Asset dictionaries are prepared once; IDs, labels and dimensions remain unchanged. */
export function publicAssets<T>(value: T): T {
  if (typeof value === 'string') return publicUrl(value) as T;
  if (Array.isArray(value)) return value.map(item => publicAssets(item)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, publicAssets(item)]),
  ) as T;
  return value;
}
