import type { NextRequest } from "next/server";

const USER_API = "https://jsonplaceholder.typicode.com/users";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UsersResponse {
  data: ApiUser[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
}

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  const floored = Math.floor(n);
  return max ? Math.min(floored, max) : floored;
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT, MAX_LIMIT);
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  const upstream = await fetch(USER_API, {
    next: { revalidate: 3600 },
  });

  if (!upstream.ok) {
    return Response.json(
      { error: `Server can't be reached.` },
      { status: 502 },
    );
  }

  const all = (await upstream.json()) as ApiUser[];

  const filtered = search
    ? all.filter((u) =>
        [u.name, u.username, u.email, u.company?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(search)),
      )
    : all;

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * limit;
  const data = filtered.slice(start, start + limit);

  const body: UsersResponse = {
    data,
    page: safePage,
    limit,
    total,
    pageCount,
  };

  return Response.json(body);
}
