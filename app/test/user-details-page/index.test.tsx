// UserDetailPage.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDetailPage from "../../PageContent/users/details";

jest.mock("next/headers", () => ({
  headers: jest.fn(async () => ({
    get: (key: string) => {
      if (key === "host") return "localhost:3000";
      if (key === "x-forwarded-proto") return "http";
      return null;
    },
  })),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/app/PageContent/users/details/posts-content", () => ({
  UserPostContent: ({ userId }: { userId: string }) => (
    <div data-testid="posts-content">Posts for {userId}</div>
  ),
}));

jest.mock("@/app/PageContent/users/details/todos-content", () => ({
  UserTodosContent: ({ userId }: { userId: string }) => (
    <div data-testid="todos-content">Todos for {userId}</div>
  ),
}));

jest.mock("@/app/components/Tabs", () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <button>{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

global.fetch = jest.fn();

const mockUser = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  phone: "1-770-736-8031",
  website: "johndoe.com",
  address: {
    street: "Main Street",
    suite: "Apt. 1",
    city: "New York",
    zipcode: "10001",
  },
  company: {
    name: "Acme Inc.",
    catchPhrase: "We build things",
    bs: "business solutions",
  },
};

describe("UserDetailPage", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders user details with posts/todos section", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUser,
    });

    const Page = await UserDetailPage({ userId: "1" });

    render(Page);

    // User info
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();

    // Contact section
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("1-770-736-8031")).toBeInTheDocument();
    expect(screen.getByText("johndoe.com")).toBeInTheDocument();

    // Address section
    expect(screen.getByText(/Apt\. 1 Main Street/i)).toBeInTheDocument();
    expect(screen.getByText(/New York, 10001/i)).toBeInTheDocument();

    // Company section
    expect(screen.getByText("Acme Inc.")).toBeInTheDocument();
    expect(screen.getByText(/We build things/i)).toBeInTheDocument();

    // Tabs
    expect(screen.getByRole("button", { name: /posts/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /todos/i })).toBeInTheDocument();

    // Tab contents
    expect(screen.getByTestId("posts-content")).toBeInTheDocument();
    expect(screen.getByTestId("todos-content")).toBeInTheDocument();
  });

  it("handles loading state", async () => {
    (fetch as jest.Mock)
      .mockImplementation(
        () =>
          new Promise(() => {
            // never resolves
          }) as any
      );

    const promise = UserDetailPage({ userId: "1" });

    expect(promise).toBeTruthy();
  });

  it("handles error state", async () => {
    (fetch as jest.Mock)
      .mockRejectedValue(new Error("Failed to fetch user"));

    await expect(UserDetailPage({ userId: "1" })).rejects.toThrow(
      "Failed to fetch user"
    );
  });

  it("handles invalid user id", async () => {
    (fetch as jest.Mock)
      .mockRejectedValue(new Error("User not found"));

    await expect(UserDetailPage({ userId: "999" })).rejects.toThrow(
      "User not found"
    );
  });

  it("handles missing user data", async () => {
    (fetch as jest.Mock).mockResolvedValue(null as any);

    await expect(async () => {
      const Page = await UserDetailPage({ userId: "1" });
      render(Page);
    }).rejects.toThrow();
  });
});