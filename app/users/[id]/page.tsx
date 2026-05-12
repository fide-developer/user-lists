import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  FiBriefcase,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import type { ApiUser } from "@/app/api/users/route";
import { buildUserPath } from "@/app/endpoints/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/Tabs";
import { UserTodosContent } from "./todos-content";
import { UserPostContent } from "./posts-content";

const getUser = cache(async (id: string): Promise<ApiUser> => {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const url = `${protocol}://${host}${buildUserPath(id)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
  return res.json();
});

export async function generateMetadata({
  params,
}: PageProps<"/users/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const user = await getUser(id);
    return {
      title: `${user.name} (@${user.username})`,
      description: `${user.name} works at ${user.company.name}. Contact: ${user.email}`,
      openGraph: {
        title: `${user.name} (@${user.username})`,
        description: `${user.name} works at ${user.company.name}`,
        type: "profile",
      },
    };
  } catch {
    return { title: "User not found" };
  }
}

export default async function UserDetailPage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <>
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">{user.name}</h1>
        <p className="text-black/60 dark:text-white/60">@{user.username}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Contact" icon={<FiMail aria-hidden />}>
          <DetailRow icon={<FiMail aria-hidden />} label="Email">
            <a
              href={`mailto:${user.email}`}
              className="hover:underline"
            >
              {user.email}
            </a>
          </DetailRow>
          <DetailRow icon={<FiPhone aria-hidden />} label="Phone">
            <a
              href={`tel:${user.phone.replace(/[^+\d]/g, "")}`}
              className="hover:underline"
            >
              {user.phone}
            </a>
          </DetailRow>
          <DetailRow icon={<FiGlobe aria-hidden />} label="Website">
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {user.website}
            </a>
          </DetailRow>
        </Section>

        <Section title="Address" icon={<FiMapPin aria-hidden />}>
          <address className="not-italic text-sm leading-relaxed">
            {user.address.suite} {user.address.street}
            <br />
            {user.address.city}, {user.address.zipcode}
          </address>
        </Section>

        <Section
          title="Company"
          icon={<FiBriefcase aria-hidden />}
          className="md:col-span-2"
        >
          <p className="font-medium">{user.company.name}</p>
          <p className="text-sm italic text-black/60 dark:text-white/60">
            &ldquo;{user.company.catchPhrase}&rdquo;
          </p>
          <p className="text-sm text-black/60 dark:text-white/60">
            {user.company.bs}
          </p>
        </Section>
      </div>
      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">
            Posts
          </TabsTrigger>

          <TabsTrigger value="todos">
            Todos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <UserPostContent userId={id} />
        </TabsContent>

        <TabsContent value="todos">
          <UserTodosContent userId={id} />
        </TabsContent>
      </Tabs>
    </>
  );
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
