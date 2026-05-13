import { UserPost } from "@/app/api/users/route"

interface PostContentCardProps {
    data: UserPost
}

export const PostContentCard: React.FC<PostContentCardProps> = ({data}) => {
    return (
        <div
            className="flex flex-col flex-nowrap gap-4 mt-4 rounded-2xl
            border border-black/10
            bg-white/70 p-5
            shadow-sm backdrop-blur-sm
            dark:border-white/10
            dark:bg-white/3"
        >
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p>{data.body}</p>
        </div>
    )
}