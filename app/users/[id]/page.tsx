import UserDetailPage from "@/app/PageContent/users/details";

export default async function Page({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;

  return <UserDetailPage userId={id} />;
}

export function Section({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`space-y-3 rounded-lg border border-black/10 p-5 dark:border-white/15 ${className}`.trim()}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        {icon}
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 text-black/40 dark:text-white/40">{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">
          {label}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
