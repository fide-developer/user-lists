'use client'

import { UserPost } from "@/app/api/users/route"
import useUserPosts from "@/app/hooks/useUsers/useUserPosts"

interface PostContentCardProps {
    data: UserPost
}

const PostContentCard: React.FC<PostContentCardProps> = ({data}) => {
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

export interface UserPostContentProps {
    userId: string
}

export const UserPostContent: React.FC<UserPostContentProps> = ({ userId }) => {
    const {data: posts, isLoading, isError} = useUserPosts(userId)

    return (
        <div>
            {posts?.map((post) => <PostContentCard key={post.id} data={post} />)}
        </div>
    )
}