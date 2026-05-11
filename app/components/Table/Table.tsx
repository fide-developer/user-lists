import type { ComponentProps } from "react";

function Table({ className = "", children, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full caption-bottom text-sm ${className}`.trim()}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function Header({ className = "", ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={`border-b border-black/10 dark:border-white/15 ${className}`.trim()}
      {...props}
    />
  );
}

function Body({ className = "", ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={`divide-y divide-black/5 dark:divide-white/10 ${className}`.trim()}
      {...props}
    />
  );
}

function Footer({ className = "", ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={`border-t border-black/10 dark:border-white/15 ${className}`.trim()}
      {...props}
    />
  );
}

function Row({ className = "", ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={`transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.04] ${className}`.trim()}
      {...props}
    />
  );
}

function Head({ className = "", ...props }: ComponentProps<"th">) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60 ${className}`.trim()}
      {...props}
    />
  );
}

function Cell({ className = "", ...props }: ComponentProps<"td">) {
  return (
    <td
      className={`px-4 py-3 align-middle ${className}`.trim()}
      {...props}
    />
  );
}

function Caption({ className = "", ...props }: ComponentProps<"caption">) {
  return (
    <caption
      className={`mt-4 text-sm text-black/60 dark:text-white/60 ${className}`.trim()}
      {...props}
    />
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;
Table.Caption = Caption;

export default Table;
