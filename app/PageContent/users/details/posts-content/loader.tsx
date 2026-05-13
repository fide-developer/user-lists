import Skeleton from "@/app/components/Skeleton"

export const UserPostLoader: React.FC = () => {
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