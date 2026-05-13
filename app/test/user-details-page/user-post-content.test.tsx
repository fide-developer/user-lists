// posts-content.test.tsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import useUserPosts from "@/app/hooks/useUsers/useUserPosts";
import { UserPostContent } from "@/app/PageContent/users/details/posts-content";

jest.mock("@/app/hooks/useUsers/useUserPosts");

jest.mock("@/app/PageContent/users/details/posts-content/loader", () => ({
  UserPostLoader: () => (
    <div data-testid="post-loader">
      Mocked Loader
    </div>
  ),
}));

jest.mock("@/app/PageContent/users/details/posts-content/error-display", () => ({
  ErrorDisplay: () => (
    <div data-testid="post-error">
      Mocked Error
    </div>
  ),
}));

jest.mock("@/app/PageContent/users/details/posts-content/card", () => ({
  PostContentCard: ({ data }: any) => (
    <div data-testid="post-card">
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  ),
}));

const mockedUseUserPosts = useUserPosts as jest.Mock;

describe("UserPostContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseUserPosts.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<UserPostContent userId="1" />);

    expect(
      screen.getByTestId("post-loader")
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseUserPosts.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<UserPostContent userId="1" />);

    expect(
      screen.getByTestId("post-error")
    ).toBeInTheDocument();
  });

  it("renders user posts", () => {
    mockedUseUserPosts.mockReturnValue({
      data: [
        {
          id: 1,
          title: "First Post",
          body: "This is the first post",
        },
        {
          id: 2,
          title: "Second Post",
          body: "This is the second post",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<UserPostContent userId="1" />);

    const cards = screen.getAllByTestId("post-card");

    expect(cards).toHaveLength(2);

    expect(
      screen.getByText("First Post")
    ).toBeInTheDocument();

    expect(
      screen.getByText("This is the first post")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Second Post")
    ).toBeInTheDocument();

    expect(
      screen.getByText("This is the second post")
    ).toBeInTheDocument();
  });

  it("renders empty state when posts are empty", () => {
    mockedUseUserPosts.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<UserPostContent userId="1" />);

    expect(
      screen.queryByTestId("post-card")
    ).not.toBeInTheDocument();
  });

  it("calls useUserPosts with correct userId", () => {
    mockedUseUserPosts.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<UserPostContent userId="123" />);

    expect(mockedUseUserPosts).toHaveBeenCalledWith(
      "123"
    );
  });
});