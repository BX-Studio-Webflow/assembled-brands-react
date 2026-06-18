import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Skeleton, {
    SkeletonButton,
    SkeletonDropzone,
    SkeletonText,
} from '@/components/ui/Skeleton'

type Props = {
    title: string
    sections?: number
    showHeaderFields?: boolean
}

export default function DocumentUploadSkeleton({
    title,
    sections = 3,
    showHeaderFields = false,
}: Props) {
    return (
        <>
            <PageHeader title={title} />
            <PortalCard>
                <div className="mx-auto flex w-full max-w-[543px] flex-col items-end gap-[30px]">
                    {showHeaderFields && (
                        <div className="flex w-full flex-col gap-[20px]">
                            <Skeleton className="h-[60px] w-full" />
                        </div>
                    )}
                    {Array.from({ length: sections }).map((_, i) => (
                        <div key={i} className="flex w-full flex-col gap-[10px]">
                            <SkeletonText className="w-4/5" />
                            <Skeleton className="h-3 w-20" />
                            <SkeletonDropzone />
                        </div>
                    ))}
                    <SkeletonButton />
                </div>
            </PortalCard>
        </>
    )
}
