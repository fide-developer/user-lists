"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { UserTodo } from "@/app/api/users/route";
import { fetchUserTodos } from "@/app/endpoints/users";

export default function useUserTodo(userId: string) {
  return useQuery<UserTodo[]>({
    queryKey: ["users", "todos", userId],
    queryFn: () => fetchUserTodos(userId),
    placeholderData: keepPreviousData,
  });
}
