'use client'

import { useState } from 'react'

interface PrivateQuestionBoxProps {
  onAskQuestion: (question: string) => void
  questions: Array<{
    id: string
    question: string
    answer?: string
    timestamp: number
  }>
}

export default function PrivateQuestionBox({
  onAskQuestion,
  questions,
}: PrivateQuestionBoxProps) {
  const [question, setQuestion] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    if (question.trim()) {
      onAskQuestion(question.trim())
      setQuestion('')
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl border-2 border-blue-200 p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Ask Teacher</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            className="w-full h-24 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Send Question
          </button>
          {questions.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-600 mb-2">Your Questions:</div>
              {questions.map((item) => (
                <div key={item.id} className="text-xs mb-2 p-2 bg-gray-50 rounded">
                  <div className="text-gray-700">{item.question}</div>
                  {item.answer && (
                    <div className="text-blue-600 mt-1">Teacher: {item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg"
        >
          Ask Teacher
        </button>
      )}
    </div>
  )
}


