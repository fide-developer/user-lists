// users-page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UsersPage from "@/app/PageContent/users";
import { TestProviders } from "../test-provider";

const pushMock = jest.fn();

global.fetch = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/users",
}));

jest.mock("@/app/PageContent/users/users-search", () => ({
  __esModule: true,
  default: ({ defaultValue }: any) => {
    return (
      <input
        data-testid="search-input"
        defaultValue={defaultValue}
        onChange={(e) => {
          const value = e.target.value;

          const params = new URLSearchParams();
          if (value) params.set("search", value);

          pushMock(`/users?${params.toString()}`);
        }}
      />
    );
  },
}));

jest.mock("@/app/PageContent/users/users-filter", () => ({
  UserListFilter: () => {
    return (
      <div>
        <button
          data-testid="filter-pending"
          onClick={() => {
            pushMock("/users?todo=pending");
          }}
        >
          pending
        </button>

        <button
          data-testid="sort-az"
          onClick={() => {
            pushMock("/users?sort=a-z");
          }}
        >
          sort A-Z
        </button>
      </div>
    );
  },
}));

jest.mock("@/app/PageContent/users/users-loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">loading</div>,
}));

// jest.mock("@/app/components/Table", () => {
//   const Table = ({ children }: any) => <div>{children}</div>;
//   Table.Header = ({ children }: any) => <div>{children}</div>;
//   Table.Body = ({ children }: any) => <div>{children}</div>;
//   Table.Row = ({ children, ...props }: any) => <div {...props}>{children}</div>;
//   Table.Head = ({ children }: any) => <div>{children}</div>;
//   Table.Cell = ({ children }: any) => <div>{children}</div>;
//   return { __esModule: true, default: Table };
// });

jest.mock("@/app/components/Pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
  parsePage: () => 1,
}));

const mockFetch = fetch as jest.Mock;

describe("UsersPage - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockApi(data: any) {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => data,
    });
  }

  it("shows loading state", () => {
    mockApi({
      data: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

it("renders users with derived activity signals", async () => {
  mockApi({
    data: [
      {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        website: "example.com",
        totalCompletedTodos: 3,
        totalPendingTodos: 2,
        totalPost: 5,
        company: { name: "Acme" },
        address: { city: "NYC" },
      },
    ],
    total: 1,
    page: 1,
    pageCount: 1,
  });

  render(
    <TestProviders>
        <UsersPage />
    </TestProviders>
  );

  const row = await screen.findByTestId("user-row-1");

  expect(row).toHaveTextContent("John Doe");
  expect(row).toHaveTextContent("@johndoe");

  expect(row).toHaveTextContent("Todo: 3/5");
  expect(row).toHaveTextContent("Post: 5");
});

  it("shows empty state", async () => {
    mockApi({
      data: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });

  it("handles error and retry", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          total: 0,
          page: 1,
          pageCount: 1,
        }),
      });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();

    screen.getByRole("button", { name: /try again/i }).click();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("updates search param and triggers navigation", async () => {
    mockApi({
      data: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    const input = screen.getByTestId("search-input");

    fireEvent.change(input, {
      target: { value: "john" },
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/users?search=john");
    });
  });

  it("applies filter via todo param", async () => {
    mockApi({
      data: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    fireEvent.click(screen.getByTestId("filter-pending"));

    expect(pushMock).toHaveBeenCalledWith("/users?todo=pending");
  });

  it("applies sort param", async () => {
    mockApi({
      data: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });

    render(
        <TestProviders>
            <UsersPage />
        </TestProviders>
    );

    fireEvent.click(screen.getByTestId("sort-az"));

    expect(pushMock).toHaveBeenCalledWith("/users?sort=a-z");
  });
});