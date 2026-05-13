'use client'

import useUserTodo from "@/app/hooks/useUsers/useUserTodos"
import { ErrorDisplay } from "./error"
import { UserTodosLoader } from "./loader"
import { TodoContentCard } from "./card"

export interface UserTodosContentProps {
    userId: string
}

export const UserTodosContent: React.FC<UserTodosContentProps> = ({ userId }) => {
    const {data: todos, isLoading, isError} = useUserTodo(userId)

    if (isError) return <ErrorDisplay />
    if(isLoading) return <UserTodosLoader />
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos?.map((todo) => <TodoContentCard key={todo.id} data={todo} />)}
        </div>
    )
}