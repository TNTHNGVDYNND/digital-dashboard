import type { FilterClause, FilterQuery } from '@/types/filters';

const CANONICAL_KEYS = ['status', 'from', 'to', 'tier'] as const;
type CanonicalKey = (typeof CANONICAL_KEYS)[number];

/**
 * Parse a query string or URLSearchParams into a canonical FilterQuery.
 * Strips unknown keys and omits empty values.
 */
export function parseFilterQuery(input: string | URLSearchParams): FilterQuery {
  const params = typeof input === 'string' ? new URLSearchParams(input) : input;
  const result: FilterQuery = {};

  for (const key of CANONICAL_KEYS) {
    const value = params.get(key);
    if (value !== null && value !== '') {
      result[key as keyof FilterQuery] = value;
    }
  }

  return result;
}

/**
 * Validate that a date range is well-formed.
 * Returns true if valid or no range is present.
 * Returns false if from > to.
 */
export function validateDateRange(from?: string, to?: string): boolean {
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (fromDate > toDate) return false;
  }
  return true;
}

/**
 * Serialize a FilterQuery into a canonical query string.
 * Deterministic key order: status, from, to, tier.
 * Omits empty keys.
 */
export function serializeFilterQuery(query: FilterQuery): string {
  const parts: string[] = [];
  for (const key of CANONICAL_KEYS) {
    const value = query[key as keyof FilterQuery];
    if (value !== undefined && value !== '') {
      parts.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return parts.join('&');
}

/**
 * Derive FilterClause[] from a parsed FilterQuery.
 */
export function deriveFilterClauses(query: FilterQuery): FilterClause[] {
  const filters: FilterClause[] = [];
  for (const key of CANONICAL_KEYS) {
    const value = query[key as keyof FilterQuery];
    if (value !== undefined && value !== '') {
      filters.push({ key, value });
    }
  }
  return filters;
}

/**
 * Process a raw query string: parse, validate, canonicalize, derive filters.
 * Returns null if the query is malformed, oversized, or has invalid date ranges.
 */
export function processFilterQuery(query: string): { canonical: string; filters: FilterClause[] } | null {
  if (query.length > 512) return null;

  const parsed = parseFilterQuery(query);
  if (!validateDateRange(parsed.from, parsed.to)) return null;

  const canonical = serializeFilterQuery(parsed);
  const filters = deriveFilterClauses(parsed);

  return { canonical, filters };
}
