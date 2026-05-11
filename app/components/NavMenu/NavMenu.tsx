export default function NavMenu({ children }: { children: React.ReactNode }) {
  return <ul className="flex items-center gap-6 text-sm">{children}</ul>;
}
