"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "@/app/components/Search";

export default function UsersSearch({
  defaultValue = "",
  placeholder,
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <Search
      onSearch={handleSearch}
      defaultValue={defaultValue}
      placeholder={placeholder}
    />
  );
}
