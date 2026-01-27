'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getSocket } from '@/lib/useSocket'
import { Classroom, Student, ToolType } from '@/lib/types'
import TeacherSidebar from '@/components/TeacherSidebar'
import ToolSelector from '@/components/ToolSelector'
import StudentViewer from '@/components/StudentViewer'
import ResearchManager from '@/components/ResearchManager'
import GroupManager from '@/components/GroupManager'
import PrivateQuestions from '@/components/PrivateQuestions'
import QuestionsManager from '@/components/QuestionsManager'
import CurriculumManager from '@/components/CurriculumManager'

export default function TeacherClassroomPage() {
  const params = useParams()
  const classroomId = params.id as string
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tools' | 'curriculum'>('tools')
  const hasLoadedOnceRef = useRef(false)

  useEffect(() => {
    const loadClassroom = async (isInitialLoad: boolean) => {
      try {
        if (!classroomId) {
          console.error('No classroomId found in route params')
          if (isInitialLoad) {
            setError('Classroom not found. Please return to the dashboard and create a new classroom.')
          }
          return
        }

        const response = await fetch(`/api/classroom/${classroomId}`)
        if (!response.ok) {
          console.error('Failed to load classroom. Status:', response.status)
          // Only set error on initial load, not on refresh attempts
          if (isInitialLoad && !hasLoadedOnceRef.current) {
            if (response.status === 404) {
              setError('This classroom could not be found. It may have been closed or the link is invalid.')
            } else {
              setError('There was a problem loading this classroom. Please try again or create a new one.')
            }
          }
          return
        }

        const data = await response.json()
        setClassroom(data)
        setError(null)
        hasLoadedOnceRef.current = true
      } catch (error) {
        console.error('Failed to load classroom:', error)
        // Only set error on initial load, not on refresh attempts
        if (isInitialLoad && !hasLoadedOnceRef.current) {
          setError('There was a problem loading this classroom. Please try again.')
        }
      }
    }

    // Initial load
    loadClassroom(true)
    // Refresh every couple seconds (but don't show errors on refresh failures)
    const interval = setInterval(() => {
      loadClassroom(false)
    }, 2000)

    const socket = getSocket()
    socket.emit('join-classroom', { classroomId, role: 'teacher' })

    socket.on('student-list-updated', () => {
      loadClassroom(false)
    })

    socket.on('response-updated', () => {
      loadClassroom(false)
    })

    socket.on('question-updated', () => {
      loadClassroom(false)
    })

    socket.on('groups-changed', () => {
      loadClassroom(false)
    })

    socket.on('research-links-updated', () => {
      loadClassroom(false)
    })

    socket.on('student-response', () => {
      loadClassroom(false)
    })

    socket.on('question-asked', () => {
      loadClassroom(false)
    })

    return () => {
      clearInterval(interval)
      socket.off('student-list-updated')
      socket.off('response-updated')
      socket.off('question-updated')
      socket.off('groups-changed')
      socket.off('research-links-updated')
      socket.off('student-response')
      socket.off('question-asked')
    }
  }, [classroomId])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl text-red-600 text-center max-w-xl">{error}</div>
        <button
          onClick={() => window.location.href = '/teacher/dashboard'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Teacher Dashboard
        </button>
      </div>
    )
  }

  const handleToggleTool = async (toolType: ToolType) => {
    try {
      const response = await fetch(`/api/classroom/${classroomId}/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setClassroom(updated)
        setRefreshKey(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to toggle tool:', error)
    }
  }

  const handleAddResearchLink = async (url: string) => {
    try {
      const response = await fetch(`/api/classroom/${classroomId}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, action: 'add' }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setClassroom(updated)
      }
    } catch (error) {
      console.error('Failed to add research link:', error)
    }
  }

  const handleRemoveResearchLink = async (url: string) => {
    try {
      const response = await fetch(`/api/classroom/${classroomId}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, action: 'remove' }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setClassroom(updated)
        const socket = getSocket()
        socket.emit('research-link-added', { classroomId })
      }
    } catch (error) {
      console.error('Failed to remove research link:', error)
    }
  }

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading classroom...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TeacherSidebar
        students={classroom.students}
        selectedStudent={selectedStudent}
        onSelectStudent={setSelectedStudent}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {classroom.teacherName}&#39;s Classroom
              </h1>
              <p className="text-gray-600">
                Join Code: <span className="font-mono font-bold text-lg">{classroom.joinCode}</span>
              </p>
            </div>
            {selectedStudent && (
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank')
                  if (printWindow && selectedStudent) {
                    const timestamp = new Date().toLocaleString()
                    let content = `
                      <html>
                        <head>
                          <title>${selectedStudent.name}&#39;s Work</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #333; }
                            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                            .section h2 { color: #3B82F6; margin-top: 0; }
                            .timestamp { color: #666; font-size: 12px; }
                            img { max-width: 100%; height: auto; }
                            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                            table td, table th { border: 1px solid #ddd; padding: 8px; }
                            table th { background-color: #f2f2f2; }
                          </style>
                        </head>
                        <body>
                          <h1>${selectedStudent.name}&#39;s Work</h1>
                          <div class="timestamp">Generated: ${timestamp}</div>
                    `
                    
                    if (selectedStudent.responses.designThinking) {
                      const dt = selectedStudent.responses.designThinking
                      content += `
                        <div class="section">
                          <h2>Design Thinking Process</h2>
                          <p><strong>Connect & Define:</strong> ${dt.connectDefine || '(No response)'}</p>
                          <p><strong>Ideate:</strong> ${dt.ideate || '(No response)'}</p>
                          <p><strong>Create:</strong> ${dt.create || '(No response)'}</p>
                          <p><strong>Implement:</strong> ${dt.implement || '(No response)'}</p>
                          <p><strong>Reflect & Improve:</strong> ${dt.reflectImprove || '(No response)'}</p>
                        </div>
                      `
                    }
                    
                    if (selectedStudent.responses.decisionMatrix) {
                      const dm = selectedStudent.responses.decisionMatrix
                      content += `
                        <div class="section">
                          <h2>Decision Matrix</h2>
                          <table>
                            <tr><th>Criteria</th><th>Weight</th>${dm.groupMembers.map(m => `<th>${m}</th>`).join('')}</tr>
                            ${dm.criteria.map(c => `
                              <tr>
                                <td>${c.name || '(Unnamed)'}</td>
                                <td>${c.weight}</td>
                                ${dm.groupMembers.map(m => `<td>${c.ratings[m] || 0}</td>`).join('')}
                              </tr>
                            `).join('')}
                          </table>
                        </div>
                      `
                    }
                    
                    if (selectedStudent.responses.drawing) {
                      content += `
                        <div class="section">
                          <h2>Drawing</h2>
                          <img src="${selectedStudent.responses.drawing.image}" alt="Student drawing" />
                      `
                      if (selectedStudent.responses.drawing.comment) {
                        content += `<p><strong>Comment:</strong> ${selectedStudent.responses.drawing.comment}</p>`
                      }
                      content += `</div>`
                    }
                    
                    if (selectedStudent.responses.questions && selectedStudent.responses.questions.length > 0) {
                      content += `
                        <div class="section">
                          <h2>Questions & Answers</h2>
                          ${selectedStudent.responses.questions.map(q => `
                            <p><strong>Q:</strong> ${q.question}</p>
                            <p><strong>A:</strong> ${q.answer || '(No answer)'}</p>
                            <hr>
                          `).join('')}
                        </div>
                      `
                    }

                    if (selectedStudent.responses.vennDiagram) {
                      const vd = selectedStudent.responses.vennDiagram
                      content += `
                        <div class="section">
                          <h2>Venn Diagram</h2>
                          <p><strong>Left Set (${vd.leftLabel}):</strong> ${vd.items.filter(i => i.position === 'left').map(i => i.text).join(', ') || 'None'}</p>
                          <p><strong>Intersection:</strong> ${vd.items.filter(i => i.position === 'center').map(i => i.text).join(', ') || 'None'}</p>
                          <p><strong>Right Set (${vd.rightLabel}):</strong> ${vd.items.filter(i => i.position === 'right').map(i => i.text).join(', ') || 'None'}</p>
                        </div>
                      `
                    }
                    
                    content += `
                        </body>
                      </html>
                    `
                    
                    printWindow.document.write(content)
                    printWindow.document.close()
                    setTimeout(() => printWindow.print(), 250)
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Print/Export Student Work
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 p-6 space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tools'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tools
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'curriculum'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Curriculum
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'tools' && (
              <>
                <ToolSelector
                  activeTools={classroom.activeTools}
                  onToggleTool={handleToggleTool}
                />

                {classroom.activeTools.includes('questions') && (
                  <QuestionsManager
                    classroom={classroom}
                    onAddQuestion={async (question) => {
                      try {
                        const response = await fetch(`/api/classroom/${classroomId}/question`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ question, action: 'add' }),
                        })
                        if (response.ok) {
                          const { classroom: updated } = await response.json()
                          setClassroom(updated)
                        }
                      } catch (error) {
                        console.error('Failed to add question:', error)
                      }
                    }}
                    onEditQuestion={async (questionId, question) => {
                      try {
                        const response = await fetch(`/api/classroom/${classroomId}/question`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ questionId, question, action: 'edit' }),
                        })
                        if (response.ok) {
                          const { classroom: updated } = await response.json()
                          setClassroom(updated)
                        }
                      } catch (error) {
                        console.error('Failed to edit question:', error)
                      }
                    }}
                    onDeleteQuestion={async (questionId) => {
                      try {
                        const response = await fetch(`/api/classroom/${classroomId}/question`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ questionId, action: 'delete' }),
                        })
                        if (response.ok) {
                          const { classroom: updated } = await response.json()
                          setClassroom(updated)
                        }
                      } catch (error) {
                        console.error('Failed to delete question:', error)
                      }
                    }}
                  />
                )}

                {selectedStudent && (
                  <StudentViewer
                    key={`${selectedStudent.studentId}-${refreshKey}`}
                    student={selectedStudent}
                    activeTools={classroom.activeTools}
                  />
                )}
              </>
            )}

            {activeTab === 'curriculum' && (
              <CurriculumManager />
            )}
          </div>

          <div className="w-80 bg-white border-l p-4 space-y-4 overflow-y-auto">
            <GroupManager
              classroomId={classroomId}
              students={classroom.students}
              groups={classroom.groups}
            />
            <ResearchManager
              researchLinks={classroom.researchLinks}
              onAddLink={handleAddResearchLink}
              onRemoveLink={handleRemoveResearchLink}
            />
            <PrivateQuestions
              students={classroom.students}
              classroom={classroom}
              onAnswerQuestion={async (studentId, questionId, answer) => {
                try {
                  const response = await fetch(`/api/classroom/${classroomId}/question`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      studentId,
                      questionId,
                      answer,
                      action: 'answer',
                    }),
                  })
                  if (response.ok) {
                    const { classroom: updated } = await response.json()
                    setClassroom(updated)
                  }
                } catch (error) {
                  console.error('Failed to answer question:', error)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
