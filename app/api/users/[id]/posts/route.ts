import type { NextRequest } from "next/server";
import type { UserPost } from "@/app/api/users/route";

const USER_API = `${process.env.API_ENDPOINTS}/posts`;

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/users/[id]/posts">,
): Promise<Response> {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return Response.json({ error: "Invalid user id" }, { status: 400 });
  }

  const upstream = await fetch(`${USER_API}?userId=${id}`, {
    next: { revalidate: 3600 },
  });

  if (upstream.status === 404) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (!upstream.ok) {
    return Response.json(
      { error: "Server can't be reached." },
      { status: 502 },
    );
  }

  const posts = (await upstream.json()) as UserPost[];

  return Response.json(posts);
}
