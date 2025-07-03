import { useState } from 'react'
import Card from '@/components/ui/Card'
import Menu from '@/components/ui/Menu'
import Question from './Question'
import { questionList, questionCategory } from './constants'

const FAQ = () => {
    const [selectedCategory, setSelectedCategory] = useState('general')

    return (
        <Card>
            <div className="flex flex-col md:flex-row gap-4 md:gap-20 mt-8">
                <div className="min-w-[230px]">
                    <Menu>
                        {Object.entries(questionList).map(([key]) => (
                            <Menu.MenuItem
                                key={key}
                                isActive={key === selectedCategory}
                                eventKey={key}
                                onSelect={setSelectedCategory}
                            >
                                {questionCategory[key]}
                            </Menu.MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className="max-w-[800px] my-2">
                    <div className="">
                        {questionList[selectedCategory].map(
                            (question, index) => (
                                <Question
                                    key={question.title}
                                    border={
                                        index !==
                                        questionList[selectedCategory].length -
                                            1
                                    }
                                    isFirstChild={index === 0}
                                    {...question}
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default FAQ
