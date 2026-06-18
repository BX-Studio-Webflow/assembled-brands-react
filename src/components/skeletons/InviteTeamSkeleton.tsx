import Skeleton, { SkeletonField, SkeletonTableRow } from '@/components/ui/Skeleton'

export default function InviteTeamSkeleton() {
    return (
        <>
            <Skeleton className="mb-6 h-10 w-64" />
            <div className="rounded border border-ink/10 bg-white p-8">
                <div className="mx-auto flex max-w-[543px] flex-col gap-[30px]">
                    <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2">
                        <SkeletonField />
                        <SkeletonField />
                    </div>
                    <SkeletonField />
                    <Skeleton className="h-[120px] w-full" />
                    <Skeleton className="ml-auto h-[52px] w-[140px] rounded-full" />
                </div>
            </div>
            <div className="mt-6 overflow-hidden rounded border border-ink/10 bg-white">
                <Skeleton className="h-14 w-full rounded-none" />
                {Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonTableRow key={i} />
                ))}
            </div>
        </>
    )
}
