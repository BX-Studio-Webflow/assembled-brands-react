import Skeleton, { SkeletonField } from '@/components/ui/Skeleton'
import StepProgress from '@/components/ui/StepProgress'

type Props = {
    step?: number
    total?: number
}

export default function QualifyStepSkeleton({ step = 1, total = 3 }: Props) {
    return (
        <div className="flex flex-col gap-[30px]">
            <StepProgress step={step} total={total} />
            <div className="flex flex-col gap-[15px]">
                <Skeleton className="h-9 w-3/4 max-w-[360px]" />
                <Skeleton className="h-4 w-full max-w-[420px]" />
            </div>
            <div className="flex flex-col gap-[20px]">
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
            </div>
            <div className="flex justify-end gap-[10px]">
                <Skeleton className="h-[52px] w-[100px] rounded-full" />
                <Skeleton className="h-[52px] w-[100px] rounded-full" />
            </div>
        </div>
    )
}
