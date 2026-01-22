import { NextRequest, NextResponse } from 'next/server'
import { toggleTool, getClassroom } from '@/lib/store'

declare global {
  var io: any
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classroomId = decodeURIComponent(params.id)
    const { toolType } = await request.json()
    if (!toolType) {
      return NextResponse.json({ error: 'Tool type required' }, { status: 400 })
    }

    const success = toggleTool(classroomId, toolType)
    if (!success) {
      return NextResponse.json({ error: 'Failed to toggle tool' }, { status: 404 })
    }

    const classroom = getClassroom(classroomId)

    // Emit socket event to notify clients of tool changes
    if (global.io) {
      global.io.to(`classroom-${classroomId}`).emit('tool-updated', { toolType })
    }

    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle tool' }, { status: 500 })
  }
}
