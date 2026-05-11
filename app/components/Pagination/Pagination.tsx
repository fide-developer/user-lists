"use client";

import Link from "next/link";
import { createContext, useContext } from "react";
import type { ComponentProps } from "react";
import { buttonClasses } from "@/app/components/Button";
import { buildPageHref } from "./params";

type PaginationContextValue = {
  page: number;
  pageCount: number;
  getHref: (page: number) => string;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePagination() {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error("Pagination.* must be rendered inside <Pagination>");
  }
  return ctx;
}

type PaginationProps = {
  page: number;
  pageCount: number;
  pathname: string;
  searchParams?: Record<string, string | string[] | undefined>;
  getHref?: (page: number) => string;
  children: React.ReactNode;
  className?: string;
};

export default function Pagination({
  page,
  pageCount,
  pathname,
  searchParams,
  getHref,
  children,
  className = "",
}: PaginationProps) {
  const hrefBuilder =
    getHref ?? ((p: number) => buildPageHref(pathname, p, searchParams));

  return (
    <PaginationContext value={{ page, pageCount, getHref: hrefBuilder }}>
      <nav
        aria-label="Pagination"
        className={`flex items-center gap-2 ${className}`.trim()}
      >
        {children}
      </nav>
    </PaginationContext>
  );
}

type LinkProps = Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  children?: React.ReactNode;
};

export function Prev({ children = "Previous", className = "", ...rest }: LinkProps) {
  const { page, getHref } = usePagination();
  const disabled = page <= 1;
  return (
    <Link
      href={getHref(disabled ? page : page - 1)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={buttonClasses({
        size: "sm",
        intent: "secondary",
        className: `${disabled ? "pointer-events-none opacity-50" : ""} ${className}`.trim(),
      })}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Next({ children = "Next", className = "", ...rest }: LinkProps) {
  const { page, pageCount, getHref } = usePagination();
  const disabled = page >= pageCount;
  return (
    <Link
      href={getHref(disabled ? page : page + 1)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={buttonClasses({
        size: "sm",
        intent: "secondary",
        className: `${disabled ? "pointer-events-none opacity-50" : ""} ${className}`.trim(),
      })}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Pages() {
  const { page, pageCount, getHref } = usePagination();
  return (
    <ul className="flex items-center gap-1">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
        const active = p === page;
        return (
          <li key={p}>
            <Link
              href={getHref(p)}
              aria-current={active ? "page" : undefined}
              className={buttonClasses({
                size: "sm",
                intent: active ? "primary" : "ghost",
              })}
            >
              {p}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

