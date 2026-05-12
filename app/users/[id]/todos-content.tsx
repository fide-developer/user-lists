'use client'

import { UserTodo } from "@/app/api/users/route"
import useUserTodo from "@/app/hooks/useUsers/useUserTodos"

interface TodoContentCardProps {
    data: UserTodo
}

const TodoContentCard: React.FC<TodoContentCardProps> = ({data}) => {
    const isCompleted: boolean = data.completed
    const status: string = isCompleted ? 'Completed' : 'Pending'
    
    return (
        <div
            className="flex flex-col flex-nowrap gap-2 rounded-2xl
            border border-black/10
            bg-white/70 p-5
            shadow-sm backdrop-blur-sm
            dark:border-white/10
            dark:bg-white/3"
        >
            <p className={`
                w-fit rounded-xl px-2 py-0.5
                text-sm up
                ${isCompleted && 'bg-green-300/40'}
                ${!isCompleted && 'bg-amber-300/40'}
            `}>
                {status}</p>
            <h1 className="text-l font-semibold">{data.title}</h1>
        </div>
    )
}

export interface UserTodosContentProps {
    userId: string
}

export const UserTodosContent: React.FC<UserTodosContentProps> = ({ userId }) => {
    const {data: todos, isLoading, isError} = useUserTodo(userId)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos?.map((todo) => <TodoContentCard key={todo.id} data={todo} />)}
        </div>
    )
}