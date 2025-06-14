import { useState, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbCheck, TbX } from 'react-icons/tb'

const ArticleAction = () => {
    const [helpful, setHelpful] = useState('')

    const onHelpfulClick = useCallback((val: string) => {
        setHelpful(val)
    }, [])

    return (
        <>
            <Card
                bordered
                className="mt-8"
                bodyClass="flex items-center justify-between"
            >
                <div>
                    <h5>Was this article helpful?</h5>
                    <p>
                        {helpful === 'Y' ? '1' : '0'} out of{' '}
                        {helpful === 'Y' ? '1' : '0'} found this helpful
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={helpful === 'Y' && <TbCheck />}
                        variant={helpful === 'Y' ? 'solid' : 'default'}
                        onClick={() => onHelpfulClick('Y')}
                    >
                        <span>Yes</span>
                    </Button>
                    <Button
                        icon={helpful === 'N' && <TbX />}
                        variant={helpful === 'N' ? 'solid' : 'default'}
                        onClick={() => onHelpfulClick('N')}
                    >
                        <span>No</span>
                    </Button>
                </div>
            </Card>
        </>
    )
}

export default ArticleAction
