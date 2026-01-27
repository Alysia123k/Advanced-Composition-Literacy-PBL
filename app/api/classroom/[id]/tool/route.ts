import { NextRequest, NextResponse } from 'next/server'
import { toggleTool, getClassroom } from '@/lib/store'
import { handleApiProxy } from '@/lib/api-proxy'

declare global {
  var io: any
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleApiProxy(request, async () => {
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
  })
}
