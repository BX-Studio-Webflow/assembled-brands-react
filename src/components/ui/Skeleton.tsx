import { cx } from '@/lib/utils'

type SkeletonProps = {
    className?: string
}

/** Base skeleton block — pulse placeholder matching brand palette. */
export default function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            aria-hidden
            className={cx(
                'animate-pulse rounded-sm bg-ink/10',
                className,
            )}
        />
    )
}

export function SkeletonText({ className }: SkeletonProps) {
    return <Skeleton className={cx('h-4 w-full', className)} />
}

export function SkeletonHeading({ className }: SkeletonProps) {
    return <Skeleton className={cx('h-9 w-2/3 max-w-[280px]', className)} />
}

export function SkeletonField({ className }: SkeletonProps) {
    return (
        <div className={cx('flex flex-col gap-2', className)}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-[60px] w-full" />
        </div>
    )
}

export function SkeletonDropzone({ className }: SkeletonProps) {
    return <Skeleton className={cx('h-[199px] w-full', className)} />
}

export function SkeletonButton({ className }: SkeletonProps) {
    return <Skeleton className={cx('h-[52px] w-[160px] rounded-full', className)} />
}

export function SkeletonTableRow({ className }: SkeletonProps) {
    return (
        <div className={cx('flex gap-4 px-6 py-4', className)}>
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    )
}
