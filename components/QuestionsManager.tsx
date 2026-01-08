'use client'

import { useState } from 'react'
import { Classroom } from '@/lib/types'

interface QuestionsManagerProps {
  classroom: Classroom
  onAddQuestion: (question: string) => void
  onEditQuestion: (questionId: string, question: string) => void
  onDeleteQuestion: (questionId: string) => void
}

export default function QuestionsManager({
  classroom,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionsManagerProps) {
  const [newQuestion, setNewQuestion] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const handleAdd = () => {
    if (newQuestion.trim()) {
      onAddQuestion(newQuestion.trim())
      setNewQuestion('')
    }
  }

  const handleStartEdit = (questionId: string, currentText: string) => {
    setEditingId(questionId)
    setEditingText(currentText)
  }

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      onEditQuestion(editingId, editingText.trim())
      setEditingId(null)
      setEditingText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions Management</h2>
      
      {/* Add new question */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter a new question for students..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={!newQuestion.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Question
          </button>
        </div>
      </div>

      {/* List of questions */}
      <div className="space-y-3">
        {classroom.questions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No questions yet. Add a question above to get started.
          </div>
        ) : (
          classroom.questions.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingText.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm font-semibold disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium">{item.question}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStartEdit(item.id, item.question)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteQuestion(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
