'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/useSocket'

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCreateClassroom = async () => {
    if (!teacherName.trim()) {
      alert('Please enter your name')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/classroom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherName: teacherName.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create classroom')
      }

      const classroom = await response.json()

      if (!classroom || !classroom.classroomId) {
        throw new Error('Invalid classroom response')
      }

      // Join socket room
      const socket = getSocket()
      socket.emit('join-classroom', {
        classroomId: classroom.classroomId,
        role: 'teacher',
      })

      router.push(`/teacher/classroom/${classroom.classroomId}`)
    } catch (error) {
      alert('Failed to create classroom. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Classroom
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateClassroom()}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <button
            onClick={handleCreateClassroom}
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Classroom'}
          </button>
        </div>
      </div>
    </div>
  )
}