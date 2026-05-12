import type { NextRequest } from "next/server";

const USER_API = `${process.env.API_ENDPOINTS}/users`;
const USER_POST_API = `${process.env.API_ENDPOINTS}/posts`;
const USER_TODOS_API = `${process.env.API_ENDPOINTS}/todos`;

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

export interface UserTodo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

export interface UserPost {
  userId: number,
  id: number,
  title: string,
  body: string
}

export interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface ApiUser extends UserData{
  totalPost: number
  totalCompletedTodos: number
  totalPendingTodos: number
}

export interface UsersResponse {
  data: ApiUser[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
}

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  const floored = Math.floor(n);
  return max ? Math.min(floored, max) : floored;
}

async function getUsersDataWithStats() {
  try {
    const [users, posts, todos] = await Promise.all([
      fetch(USER_API, {
        next: { revalidate: 3600 },
      }).then(res => res.json()),
      fetch(USER_POST_API, {
        next: { revalidate: 3600 },
      }).then(res => res.json()),
      fetch(USER_TODOS_API, {
        next: { revalidate: 3600 },
      }).then(res => res.json()),
    ])

    return users.map((user: UserData) =>{
      const userId = user.id
      const userPostCount: number = posts?.filter((post: UserPost) => post.userId === userId).length
      const userTodos: UserTodo[] = todos?.filter((todo: UserTodo) => todo.userId === userId)
      const userPendingTodosCount: number = userTodos.filter((userTodo) => !userTodo.completed).length
      const userCompletedTodosCount: number = userTodos.filter((userTodo) => userTodo.completed).length
    
      return ({
        ...user,
        totalPost: userPostCount,
        totalCompletedTodos: userCompletedTodosCount,
        totalPendingTodos: userPendingTodosCount
      }) 
    })
    
  } catch (error) {
    throw(error)
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT, MAX_LIMIT);
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const filterTodo = (searchParams.get("todo") ?? "").trim().toLowerCase();
  const sort = (searchParams.get("sort") ?? "a-z").trim().toLowerCase();
  
  try {
    const all: ApiUser[] = await getUsersDataWithStats()
    
    const searched = search
      ? all.filter((u) =>
          [u.name, u.username, u.email, u.company?.name]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(search)),
        )
      : all;

    const filtered = searched.filter((userData) => {
      if (filterTodo === 'no-completed') return userData.totalCompletedTodos === 0
      if (filterTodo === 'pending') return userData.totalPendingTodos > 0
      return true
    }).sort((a, b) => sort === 'z-a' ? (a.name < b.name ? 1 : -1) : (a.name > b.name ? 1 : -1))

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * limit;
    const data = filtered.slice(start, start + limit);

    const body: UsersResponse = {
      data,
      page: safePage,
      limit,
      total,
      pageCount,
    };

    return Response.json(body);
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: `Server can't be reached.` },
      { status: 502 },
    );
  }
}
