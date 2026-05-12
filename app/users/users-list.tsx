"use client";

import { useSearchParams } from "next/navigation";
import Pagination, { parsePage } from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import useUsers from "@/app/hooks/useUsers";
import UsersLoader from "./users-loader";
import UsersSearch from "./users-search";
import { useRouter } from "next/navigation";
import { FiGlobe, FiMail } from "react-icons/fi";
import { UserListFilter } from "./users-filter";

export default function UsersList() {
  const router = useRouter()
  const sp = useSearchParams();
  const page = parsePage(sp.get("page") ?? undefined);
  const search = sp.get("search") ?? "";
  const limitStr = sp.get("limit") ?? "";
  const filterTodo = sp.get("todo") ?? "";
  const sort = sp.get("sort") ?? "";
  const limit = limitStr ? Number(limitStr) : undefined;

  const { data, isPending, isFetching, isPlaceholderData } = useUsers({
    page,
    search: search || undefined,
    limit,
    sort,
    todo: filterTodo
  });

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? 1;
  const pageCount = data?.pageCount ?? 1;

  const spRecord: Record<string, string> = {};
  sp.forEach((value, key) => {
    spRecord[key] = value;
  });

  const refetching = isFetching || isPlaceholderData;

  const navigateToUserDetailsPage = (userId: number) => {
    const userDetailsPath = `/users/${userId}`
    router.push(userDetailsPath)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {isPending
              ? "Loading..."
              : `${total} result${total === 1 ? "" : "s"}${
                  search ? ` for "${search}"` : ""
                }`}
          </p>
        </div>
        <div className="flex flex-row gap-2.5 flex-nowrap">
          <UsersSearch
            key={search}
            defaultValue={search}
            placeholder="Search by name, email, company..."
          />
          <UserListFilter />
        </div>
      </div>

      {isPending ? (
        <UsersLoader />
      ) : (
        <div
          className={`transition-opacity ${refetching ? "opacity-60" : ""}`.trim()}
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head className="table-cell md:hidden">Details</Table.Head>
                <Table.Head className="hidden md:table-cell">Email</Table.Head>
                <Table.Head className="hidden md:table-cell">Website</Table.Head>
                <Table.Head className="hidden md:table-cell">Username</Table.Head>
                <Table.Head className="hidden lg:table-cell">Company</Table.Head>
                <Table.Head className="hidden lg:table-cell">City</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.length === 0 ? (
                <Table.Row>
                  <Table.Cell
                    colSpan={5}
                    className="py-10 text-center text-black/60 dark:text-white/60"
                  >
                    No users found.
                  </Table.Cell>
                </Table.Row>
              ) : (
                users.map((user) => (
                  <Table.Row key={user.id} className="cursor-pointer" onClick={() => navigateToUserDetailsPage(user.id)}>
                    <Table.Cell className="font-medium">
                      {user.name}
                    </Table.Cell>
                    
                    {/* combined UI for contacts */}
                    <Table.Cell className="table-cell md:hidden">
                      <div>
                        <span className="flex items-center flex-row flex-nowrap gap-0.5"><FiMail aria-hidden /> {user.email}</span>
                        <span className="flex items-center flex-row flex-nowrap gap-0.5"><FiGlobe aria-hidden />{user.website}</span>
                        <div className="flex items-center flex-row flex-wrap gap-2">
                          <span>Todo: {user.totalCompletedTodos}/{user.totalCompletedTodos + user.totalPendingTodos}</span>
                          <span>Post: {user.totalPost}</span>
                        </div>
                      </div>
                    </Table.Cell>
                    {/* display only on big screen */}
                    <Table.Cell className="hidden md:table-cell">{user.email}</Table.Cell>
                    <Table.Cell className="hidden md:table-cell"><a href={`https://${user.website}`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="underline hover:text-blue-400 text-blue-500">{user.website}</a></Table.Cell>
                    
                    <Table.Cell className="hidden md:table-cell">
                      @{user.username}
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">
                      {user.company.name}
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell">
                      {user.address.city}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      {!isPending && pageCount > 1 && (
        <div className="flex justify-end">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            pathname="/users"
            searchParams={spRecord}
          >
            <Pagination.Prev />
            <Pagination.Pages />
            <Pagination.Next />
          </Pagination>
        </div>
      )}
    </div>
  );
}
