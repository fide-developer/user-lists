'use client'

import { UserPost } from "@/app/api/users/route"
import Skeleton from "@/app/components/Skeleton"
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

const ErrorDisplay: React.FC = () => {
    return (
        <div className="flex w-full items-center justify-center">Opps, failed to load user's posts content. Please try again later.</div>
    )
}

const UserPostLoader: React.FC = () => {
    return (
        <div>
            {Array(5).fill(null).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col flex-nowrap gap-4 mt-4 rounded-2xl
                    border border-black/10
                    bg-white/70 p-5
                    shadow-sm backdrop-blur-sm
                    dark:border-white/10
                    dark:bg-white/3"
                >
                    <Skeleton className="h-8 w-[90%]" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-[70%]" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export interface UserPostContentProps {
    userId: string
}

export const UserPostContent: React.FC<UserPostContentProps> = ({ userId }) => {
    const {data: posts, isLoading, isError} = useUserPosts(userId)

    if(isError) return <ErrorDisplay />
    if(isLoading) return <UserPostLoader />
    return (
        <div>
            {posts?.map((post) => <PostContentCard key={post.id} data={post} />)}
        </div>
    )
}