'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { getSocket } from '@/lib/useSocket'
import { Classroom, Student } from '@/lib/types'
import DesignThinkingTool from '@/components/tools/DesignThinkingTool'
import DecisionMatrixTool from '@/components/tools/DecisionMatrixTool'
import DrawingTool from '@/components/tools/DrawingTool'
import QuestionsTool from '@/components/tools/QuestionsTool'
<<<<<<< HEAD
=======
import VennDiagramTool from '@/components/tools/VennDiagramTool'
>>>>>>> master
import ResearchTab from '@/components/ResearchTab'
import PrivateQuestionBox from '@/components/PrivateQuestionBox'

export default function StudentClassroomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const classroomId = params.id as string
  const studentId = searchParams.get('studentId')
  
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState<'activities' | 'research'>('activities')

  useEffect(() => {
    if (!studentId) return

    const loadData = async () => {
      try {
        const response = await fetch(`/api/classroom/${classroomId}`)
        if (response.ok) {
          const data = await response.json()
          setClassroom(data)
          const foundStudent = data.students.find((s: Student) => s.studentId === studentId)
          if (foundStudent) {
            setStudent(foundStudent)
          }
        }
      } catch (error) {
        console.error('Failed to load classroom:', error)
      }
    }

    loadData()
<<<<<<< HEAD
    const interval = setInterval(loadData, 1000)
=======
    const interval = setInterval(loadData, 2000)
>>>>>>> master

    const socket = getSocket()
    socket.emit('join-classroom', { classroomId, role: 'student', studentId })

    socket.on('tool-updated', () => {
      loadData()
    })

    socket.on('groups-changed', () => {
      loadData()
    })

    socket.on('research-links-updated', () => {
      loadData()
    })

    socket.on('question-updated', () => {
      loadData()
    })

    return () => {
      clearInterval(interval)
      socket.off('tool-updated')
      socket.off('groups-changed')
      socket.off('research-links-updated')
      socket.off('question-updated')
    }
  }, [classroomId, studentId])

  const handleResponseUpdate = async (toolType: string, data: any) => {
    if (!studentId) return
    try {
      const response = await fetch(`/api/classroom/${classroomId}/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, toolType, data }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setClassroom(updated)
        const foundStudent = updated.students.find((s: Student) => s.studentId === studentId)
        if (foundStudent) setStudent(foundStudent)
        const socket = getSocket()
        socket.emit('student-response', { classroomId, studentId, toolType, data })
      }
    } catch (error) {
      console.error('Failed to update response:', error)
    }
  }

  const handleAskQuestion = async (question: string) => {
    if (!studentId) return
    try {
      const response = await fetch(`/api/classroom/${classroomId}/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, question, action: 'student-question' }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setClassroom(updated)
        const foundStudent = updated.students.find((s: Student) => s.studentId === studentId)
        if (foundStudent) setStudent(foundStudent)
        const socket = getSocket()
        socket.emit('question-asked', { classroomId, studentId })
      }
    } catch (error) {
      console.error('Failed to ask question:', error)
    }
  }

  if (!classroom || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading classroom...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {student.name}!
        </h1>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'activities'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === 'research'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Research
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'activities' ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {classroom.activeTools.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xl">
                Waiting for teacher to activate tools...
              </div>
            ) : (
              classroom.activeTools.map((toolType) => {
                switch (toolType) {
                  case 'designThinking':
                    return (
                      <DesignThinkingTool
                        key={toolType}
                        student={student}
                        onUpdate={(data) => handleResponseUpdate('designThinking', data)}
                      />
                    )
                  case 'decisionMatrix':
                    return (
                      <DecisionMatrixTool
                        key={toolType}
                        student={student}
                        classroom={classroom}
                        onUpdate={(data) => handleResponseUpdate('decisionMatrix', data)}
                      />
                    )
                  case 'drawing':
                    return (
                      <DrawingTool
                        key={toolType}
                        student={student}
                        onUpdate={(data) => handleResponseUpdate('drawing', data)}
                      />
                    )
                  case 'questions':
                    return (
                      <QuestionsTool
                        key={toolType}
                        student={student}
                        classroom={classroom}
                        onUpdate={(data) => handleResponseUpdate('questions', data)}
                      />
                    )
<<<<<<< HEAD
=======
                  case 'vennDiagram':
                    return (
                      <VennDiagramTool
                        key={toolType}
                        student={student}
                        onUpdate={(data) => handleResponseUpdate('vennDiagram', data)}
                      />
                    )
                  case 'graph':
                    return (
                      <div key={toolType} className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Graph (Desmos Calculator)</h2>
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white" style={{ minHeight: '500px' }}>
                          <iframe
                            title="Desmos Graphing Calculator"
                            src="https://www.desmos.com/calculator"
                            className="w-full h-[500px] border-0"
                            allow="fullscreen"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Use the <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Desmos graphing calculator</a> above, or open it in a new tab if needed.
                        </p>
                      </div>
                    )
>>>>>>> master
                  default:
                    return null
                }
              })
            )}
          </div>
        ) : (
          <ResearchTab researchLinks={classroom.researchLinks} />
        )}
      </div>

      <PrivateQuestionBox
        onAskQuestion={handleAskQuestion}
        questions={(() => {
          // Filter to show only private questions (student questions to teacher)
          // These are questions NOT in classroom.questions
          const teacherQuestionIds = new Set(classroom.questions.map(q => q.id))
          return (student.responses.questions || []).filter(
            q => !teacherQuestionIds.has(q.id)
          )
        })()}
      />
    </div>
  )
}
