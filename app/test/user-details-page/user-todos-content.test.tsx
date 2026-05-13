// todos-content.test.tsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import useUserTodo from "@/app/hooks/useUsers/useUserTodos";
import { UserTodosContent } from "@/app/PageContent/users/details/todos-content";

jest.mock("@/app/hooks/useUsers/useUserTodos");

jest.mock("@/app/PageContent/users/details/todos-content/loader", () => ({
  UserTodosLoader: () => (
    <div data-testid="todos-loader">
      Mocked Todos Loader
    </div>
  ),
}));

jest.mock("@/app/PageContent/users/details/todos-content/error", () => ({
  ErrorDisplay: () => (
    <div data-testid="todos-error">
      Mocked Todos Error
    </div>
  ),
}));

jest.mock("@/app/PageContent/users/details/todos-content/card", () => ({
  TodoContentCard: ({ data }: any) => (
    <div data-testid="todo-card">
      <h1>{data.title}</h1>
      <span>
        {data.completed ? "Completed" : "Pending"}
      </span>
    </div>
  ),
}));

const mockedUseUserTodo = useUserTodo as jest.Mock;

describe("UserTodosContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseUserTodo.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<UserTodosContent userId="1" />);

    expect(
      screen.getByTestId("todos-loader")
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseUserTodo.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<UserTodosContent userId="1" />);

    expect(
      screen.getByTestId("todos-error")
    ).toBeInTheDocument();
  });

  it("renders todo items", () => {
    mockedUseUserTodo.mockReturnValue({
      data: [
        {
          id: 1,
          title: "Buy groceries",
          completed: true,
        },
        {
          id: 2,
          title: "Finish report",
          completed: false,
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<UserTodosContent userId="1" />);

    const cards = screen.getAllByTestId("todo-card");

    expect(cards).toHaveLength(2);

    expect(
      screen.getByText("Buy groceries")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Completed")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Finish report")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending")
    ).toBeInTheDocument();
  });

  it("renders empty state when todos are empty", () => {
    mockedUseUserTodo.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<UserTodosContent userId="1" />);

    expect(
      screen.queryByTestId("todo-card")
    ).not.toBeInTheDocument();
  });

  it("calls useUserTodo with correct userId", () => {
    mockedUseUserTodo.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<UserTodosContent userId="123" />);

    expect(mockedUseUserTodo).toHaveBeenCalledWith(
      "123"
    );
  });
});