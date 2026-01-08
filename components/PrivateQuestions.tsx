'use client'

import { Student, Classroom } from '@/lib/types'

interface PrivateQuestionsProps {
  students: Student[]
  classroom: Classroom
  onAnswerQuestion: (studentId: string, questionId: string, answer: string) => void
}

export default function PrivateQuestions({
  students,
  classroom,
  onAnswerQuestion,
}: PrivateQuestionsProps) {
  // Separate student questions (private questions to teacher) from teacher questions
  // Student questions are those in student.responses.questions that are NOT in classroom.questions
  const allQuestions = students.flatMap(student => {
    const questions = student.responses.questions || []
    const teacherQuestionIds = new Set(classroom.questions.map(q => q.id))
    // Filter to only show student questions (not teacher questions)
    return questions
      .filter(q => !teacherQuestionIds.has(q.id))
      .map(q => ({
        ...q,
        studentId: student.studentId,
        studentName: student.name,
      }))
  }).sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Student Questions</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allQuestions.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            No questions yet
          </div>
        ) : (
          allQuestions.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">
                {item.studentName}
              </div>
              <div className="text-sm text-gray-800 mb-2">{item.question}</div>
              {item.answer ? (
                <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                  <div className="font-semibold mb-1">Your Response:</div>
                  {item.answer}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    placeholder="Type your response to this student..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey && e.currentTarget.value.trim()) {
                        onAnswerQuestion(item.studentId, item.id, e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border rounded resize-none"
                    rows={2}
                  />
                  <button
                    onClick={(e) => {
                      const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement
                      if (textarea && textarea.value.trim()) {
                        onAnswerQuestion(item.studentId, item.id, textarea.value.trim())
                        textarea.value = ''
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
                  >
                    Send Response
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}


