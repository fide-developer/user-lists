'use client'
import useUserPosts from "@/app/hooks/useUsers/useUserPosts"
import { ErrorDisplay } from "./error-display"
import { UserPostLoader } from "./loader"
import { PostContentCard } from "./card"

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