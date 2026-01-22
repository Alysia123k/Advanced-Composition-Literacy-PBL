import { NextRequest, NextResponse } from 'next/server'
import { updateStudentResponse, getClassroom } from '@/lib/store'

declare global {
  var io: any
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classroomId = decodeURIComponent(params.id)
    const { studentId, toolType, data } = await request.json()
    if (!studentId || !toolType) {
      return NextResponse.json({ error: 'Student ID and tool type required' }, { status: 400 })
    }

    const success = updateStudentResponse(classroomId, studentId, toolType, data)
    if (!success) {
      return NextResponse.json({ error: 'Failed to update response' }, { status: 404 })
    }

    const classroom = getClassroom(classroomId)

    // Emit socket event to notify clients of the update
    if (global.io) {
      global.io.to(`classroom-${classroomId}`).emit('response-updated', {
        studentId,
        toolType,
        data,
      })
    }

    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student response' }, { status: 500 })
  }
}
