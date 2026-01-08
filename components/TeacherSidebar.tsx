'use client'

import { Student } from '@/lib/types'

interface TeacherSidebarProps {
  students: Student[]
  selectedStudent: Student | null
  onSelectStudent: (student: Student) => void
}

export default function TeacherSidebar({
  students,
  selectedStudent,
  onSelectStudent,
}: TeacherSidebarProps) {
  return (
    <div className="w-64 bg-white border-r h-screen overflow-y-auto">
      <div className="p-4 border-b bg-blue-600 text-white">
        <h2 className="text-xl font-bold">Students</h2>
        <p className="text-sm opacity-90">{students.length} connected</p>
      </div>
      <div className="divide-y">
        {students.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No students joined yet
          </div>
        ) : (
          students.map((student) => (
            <button
              key={student.studentId}
              onClick={() => onSelectStudent(student)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedStudent?.studentId === student.studentId
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : ''
              }`}
            >
              <div className="font-semibold text-gray-800">{student.name}</div>
              {student.groupId && (
                <div className="text-sm text-gray-500 mt-1">
                  Group: {student.groupId.substring(0, 8)}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}


