import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Skeleton, {
    SkeletonButton,
    SkeletonField,
    SkeletonHeading,
} from '@/components/ui/Skeleton'

type Props = {
    title: string
    fields?: number
}

export default function FormPageSkeleton({ title, fields = 4 }: Props) {
    return (
        <>
            <PageHeader title={title} />
            <PortalCard>
                <div className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]">
                    <SkeletonHeading />
                    {Array.from({ length: fields }).map((_, i) => (
                        <SkeletonField key={i} />
                    ))}
                    <div className="flex justify-end gap-[10px]">
                        <SkeletonButton className="w-[100px]" />
                        <SkeletonButton className="w-[160px]" />
                    </div>
                </div>
            </PortalCard>
        </>
    )
}
