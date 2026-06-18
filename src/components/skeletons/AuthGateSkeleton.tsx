import Skeleton from '@/components/ui/Skeleton'

export default function AuthGateSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-offwhite p-8">
            <div className="flex w-full max-w-[320px] flex-col gap-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[60px] w-full" />
                <Skeleton className="h-[60px] w-full" />
                <Skeleton className="h-[52px] w-full rounded-full" />
            </div>
        </div>
    )
}
