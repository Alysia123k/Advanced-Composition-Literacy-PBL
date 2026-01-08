'use client'

import { useState } from 'react'
import { Student } from '@/lib/types'
import { getSocket } from '@/lib/useSocket'

interface GroupManagerProps {
  classroomId: string
  students: Student[]
  groups: Array<{ groupId: string; studentIds: string[] }>
}

export default function GroupManager({
  classroomId,
  students,
  groups,
}: GroupManagerProps) {
  const [groupSize, setGroupSize] = useState(3)
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [localGroups, setLocalGroups] = useState(groups)

  const handleRandomGroups = async () => {
    try {
      const response = await fetch(`/api/classroom/${classroomId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupSize, random: true }),
      })
      if (response.ok) {
        const { classroom: updated } = await response.json()
        setLocalGroups(updated.groups)
        const socket = getSocket()
        socket.emit('groups-updated', { classroomId })
      }
    } catch (error) {
      console.error('Failed to create groups:', error)
    }
  }

  const handleDragStart = (studentId: string) => {
    setIsDragging(studentId)
  }

  const handleDragOver = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault()
    if (!isDragging) return

    const newGroups = localGroups.map(group => {
      // Remove student from all groups
      const filteredIds = group.studentIds.filter(id => id !== isDragging)
      
      // Add to target group
      if (group.groupId === targetGroupId && !group.studentIds.includes(isDragging)) {
        return { ...group, studentIds: [...filteredIds, isDragging] }
      }
      
      return { ...group, studentIds: filteredIds }
    })

    // If student not in any group, add to target
    const studentInGroup = newGroups.some(g => g.studentIds.includes(isDragging))
    if (!studentInGroup) {
      const targetGroup = newGroups.find(g => g.groupId === targetGroupId)
      if (targetGroup) {
        targetGroup.studentIds.push(isDragging)
      }
    }

    setLocalGroups(newGroups)
    try {
      const response = await fetch(`/api/classroom/${classroomId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups: newGroups }),
      })
      if (response.ok) {
        const socket = getSocket()
        socket.emit('groups-updated', { classroomId })
      }
    } catch (error) {
      console.error('Failed to update groups:', error)
    }
    setIsDragging(null)
  }

  const ungroupedStudents = students.filter(
    s => !localGroups.some(g => g.studentIds.includes(s.studentId))
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Groups</h3>
      
      <div className="space-y-3 mb-3">
        <div className="flex gap-2">
          <input
            type="number"
            min="2"
            max="10"
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
            className="w-20 px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleRandomGroups}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
          >
            Random Groups
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {localGroups.map((group, index) => (
          <div
            key={group.groupId}
            onDragOver={(e) => handleDragOver(e, group.groupId)}
            onDrop={(e) => handleDrop(e, group.groupId)}
            className="p-3 border-2 border-dashed border-gray-300 rounded-lg min-h-20"
          >
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Group {index + 1}
            </div>
            <div className="space-y-1">
              {group.studentIds.map((studentId) => {
                const student = students.find(s => s.studentId === studentId)
                if (!student) return null
                return (
                  <div
                    key={studentId}
                    draggable
                    onDragStart={() => handleDragStart(studentId)}
                    className="p-2 bg-blue-50 rounded text-sm cursor-move"
                  >
                    {student.name}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {ungroupedStudents.length > 0 && (
          <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Ungrouped
            </div>
            <div className="space-y-1">
              {ungroupedStudents.map((student) => (
                <div
                  key={student.studentId}
                  draggable
                  onDragStart={() => handleDragStart(student.studentId)}
                  className="p-2 bg-gray-50 rounded text-sm cursor-move"
                >
                  {student.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

