export const PAGE_PARAM = "page" as const;

export interface PaginationSearchParams {
  [PAGE_PARAM]?: string | string[];
}

export interface PaginationState {
  page: number;
  pageCount: number;
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw ?? 1);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function buildPageHref(
  pathname: string,
  page: number,
  extraParams?: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (key === PAGE_PARAM) continue;
      if (value === undefined || value === "") continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== "") params.append(key, v);
        }
      } else {
        params.set(key, value);
      }
    }
  }
  if (page > 1) params.set(PAGE_PARAM, String(page));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
