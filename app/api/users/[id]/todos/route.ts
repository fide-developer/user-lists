import type { NextRequest } from "next/server";
import type { UserTodo } from "@/app/api/users/route";

const USER_API = `${process.env.API_ENDPOINTS}/todos`;

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/users/[id]/todos">,
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

  const todos = (await upstream.json()) as UserTodo[];

  return Response.json(todos);
}
