import Link from "next/link";
import type { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link>;

export default function NavLink({ children, ...props }: NavLinkProps) {
  return (
    <li>
      <Link {...props} className="hover:underline">
        {children}
      </Link>
    </li>
  );
}
