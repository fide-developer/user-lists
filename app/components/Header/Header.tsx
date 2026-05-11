export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {children}
      </nav>
    </header>
  );
}
