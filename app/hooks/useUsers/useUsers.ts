"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { UsersResponse } from "@/app/api/users/route";
import { fetchUsers, type UsersQuery } from "@/app/endpoints/users";

export default function useUsers(query: UsersQuery) {
  return useQuery<UsersResponse>({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(query),
    placeholderData: keepPreviousData,
  });
}
