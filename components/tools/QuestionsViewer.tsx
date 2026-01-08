'use client'

interface QuestionsViewerProps {
  questions?: Array<{
    id: string
    question: string
    answer?: string
    timestamp: number
  }>
}

export default function QuestionsViewer({ questions }: QuestionsViewerProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No questions yet
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Questions & Answers</h3>
      <div className="space-y-3">
        {questions.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="font-semibold text-gray-700 mb-2">
              Q: {item.question}
            </div>
            <div className="text-gray-600">
              A: {item.answer || '(No answer yet)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


