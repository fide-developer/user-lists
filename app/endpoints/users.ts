import type { ApiUser, UsersResponse } from "@/app/api/users/route";

export interface UsersQuery {
  page?: number;
  search?: string;
  limit?: number;
  sort?: string;
  todo?: string;
}

export function buildUsersPath(query: UsersQuery = {}): string {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.search) params.set("search", query.search);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.todo) params.set("todo", String(query.todo));
  if (query.sort) params.set("sort", String(query.sort));

  const qs = params.toString();
  return qs ? `/api/users?${qs}` : "/api/users";
}

export function buildUserPath(id: string | number): string {
  return `/api/users/${id}`;
}

export async function fetchUsers(query: UsersQuery = {}): Promise<UsersResponse> {
  const res = await fetch(buildUsersPath(query));
  if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
  return res.json();
}

export async function fetchUser(id: string | number): Promise<ApiUser> {
  const res = await fetch(buildUserPath(id));
  if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
  return res.json();
}
