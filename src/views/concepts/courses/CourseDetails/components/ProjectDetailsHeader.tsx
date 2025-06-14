import { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import ToggleDrawer from '@/components/shared/ToggleDrawer'
import ProjectDetailsNavigation from './ProjectDetailsNavigation'
import useResponsive from '@/utils/hooks/useResponsive'
import type { ToggleDrawerRef } from '@/components/shared/ToggleDrawer'

type ProjectDetailsHeaderProps = {
    title: string
    isContentEdit: boolean
    onEdit: (value: boolean) => void
    selected: string
    onChange: (value: string) => void
}

const ProjectDetailsHeader = (props: ProjectDetailsHeaderProps) => {
    const { title, onChange, selected } = props

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [copied, setCopied] = useState(false)

    const drawerRef = useRef<ToggleDrawerRef>(null)

    const { smaller } = useResponsive()

    useEffect(() => {
        if (copied) {
            const copyFeedbackInterval = setTimeout(
                () => setCopied(false),
                2000,
            )

            return () => {
                clearTimeout(copyFeedbackInterval)
            }
        }
    }, [copied])

    const handleNavigationChange = (val: string) => {
        onChange(val)
        drawerRef.current?.handleCloseDrawer()
    }

    return (
        <>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 mb-6 pb-4">
                <div className="flex items-center gap-4">
                    {smaller.xl && (
                        <ToggleDrawer ref={drawerRef} title="Navigation">
                            <ProjectDetailsNavigation
                                selected={selected}
                                onChange={handleNavigationChange}
                            />
                        </ToggleDrawer>
                    )}
                    <h3>{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsDialogOpen(true)}>Share</Button>
                </div>
            </div>
            <Dialog
                isOpen={isDialogOpen}
                width={640}
                onClose={() => setIsDialogOpen(false)}
                onRequestClose={() => setIsDialogOpen(false)}
            >
                <h5>Share this project</h5>
                <Form className="my-6">
                    <FormItem label="Copy link">
                        <Input
                            readOnly
                            value="https://edge.themenate.net/concepts/projects/project-details/27"
                            suffix={
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    customColorClass={() =>
                                        'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200'
                                    }
                                    onClick={() => setCopied(true)}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            }
                        />
                    </FormItem>
                </Form>
                <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Share
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ProjectDetailsHeader
