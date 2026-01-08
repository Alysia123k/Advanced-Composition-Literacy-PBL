'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/useSocket'

export default function StudentJoinPage() {
  const [joinCode, setJoinCode] = useState('')
  const [studentName, setStudentName] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setError('')
    
    if (!joinCode.trim() || !studentName.trim()) {
      setError('Please enter both join code and your name')
      return
    }

    setIsJoining(true)
    try {
      const response = await fetch('/api/classroom/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          joinCode: joinCode.toUpperCase(),
          studentName: studentName.trim(),
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to join classroom')
        setIsJoining(false)
        return
      }
      
      const { classroom, student } = await response.json()

      // Join socket room
      const socket = getSocket()
      socket.emit('join-classroom', {
        classroomId: classroom.classroomId,
        role: 'student',
        studentId: student.studentId,
      })
      socket.emit('student-joined', { classroomId: classroom.classroomId })

      router.push(`/student/classroom/${classroom.classroomId}?studentId=${student.studentId}`)
    } catch (error) {
      setError('Failed to join classroom. Please try again.')
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Join Classroom
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Join Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-mono uppercase"
              placeholder="Enter join code"
              maxLength={6}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            {isJoining ? 'Joining...' : 'Join Classroom'}
          </button>
        </div>
      </div>
    </div>
  )
}

