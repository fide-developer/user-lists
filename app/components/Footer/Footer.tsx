export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/15">
      <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-black/60 dark:text-white/60">
        &copy; {new Date().getFullYear()} faadjarfirdaus@gmail.com
      </div>
    </footer>
  );
}
