import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Skeleton from '@/components/ui/Skeleton'

export default function ApplicationListSkeleton() {
    return (
        <>
            <PageHeader title="My applications" />
            <PortalCard>
                <div className="flex flex-col gap-[20px]">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[68px] w-full" />
                    ))}
                </div>
            </PortalCard>
        </>
    )
}
