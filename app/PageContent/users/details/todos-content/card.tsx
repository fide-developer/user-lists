import { UserTodo } from "@/app/api/users/route"

interface TodoContentCardProps {
    data: UserTodo
}

export const TodoContentCard: React.FC<TodoContentCardProps> = ({data}) => {
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