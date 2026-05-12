"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { UserPost } from "@/app/api/users/route";
import { fetchUserPost } from "@/app/endpoints/users";

export default function useUserPosts(userId: string) {
  return useQuery<UserPost[]>({
    queryKey: ["users", "posts", userId],
    queryFn: () => fetchUserPost(userId),
    placeholderData: keepPreviousData,
  });
}
