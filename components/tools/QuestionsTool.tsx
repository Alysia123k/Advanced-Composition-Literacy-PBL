'use client'

import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { Student } from '@/lib/types'

interface QuestionsToolProps {
  student: Student
  classroom: any // Add classroom prop to access teacher questions
=======
import { Student, Classroom, ClassroomQuestion } from '@/lib/types'

interface QuestionsToolProps {
  student: Student
  classroom: Classroom
>>>>>>> master
  onUpdate: (data: any) => void
}

export default function QuestionsTool({ student, classroom, onUpdate }: QuestionsToolProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize answers from student responses
    const initialAnswers: Record<string, string> = {}
    student.responses.questions?.forEach((q: any) => {
      initialAnswers[q.id] = q.answer || ''
    })
    setAnswers(initialAnswers)
  }, [student.responses.questions])

  const handleAnswerChange = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    // Preserve existing student questions (private questions to teacher)
    const existingStudentQuestions = (student.responses.questions || []).filter(
<<<<<<< HEAD
      (q: any) => !classroom.questions.some(tq => tq.id === q.id)
=======
      (q: any) => !classroom.questions.some((tq: ClassroomQuestion) => tq.id === q.id)
>>>>>>> master
    )

    // Update student responses - merge teacher questions with existing student questions
    const updatedQuestions = [
      ...existingStudentQuestions, // Keep private questions from student
      ...classroom.questions.map(q => ({
        id: q.id,
        question: q.question,
        answer: newAnswers[q.id] || '',
        timestamp: Date.now(),
      }))
    ]

    onUpdate({ questions: updatedQuestions })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions</h2>
      <div className="space-y-4">
        {classroom.questions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No questions from teacher yet
          </div>
        ) : (
          classroom.questions.map((item: any) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="font-semibold text-gray-700 mb-3">
                {item.question}
              </div>
              <textarea
                value={answers[item.id] || ''}
                onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-vertical min-h-[80px]"
                rows={3}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
<<<<<<< HEAD


=======
>>>>>>> master
