import { NextRequest, NextResponse } from 'next/server'
import { createGroups, updateGroups, getClassroom } from '@/lib/store'
<<<<<<< HEAD
=======
import { handleApiProxy } from '@/lib/api-proxy'

declare global {
  var io: any
}
>>>>>>> master

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
<<<<<<< HEAD
  try {
    const { groupSize, random, groups } = await request.json()
    
    if (groups) {
      // Manual group assignment
      const success = updateGroups(params.id, groups)
=======
  return handleApiProxy(request, async () => {
    const classroomId = decodeURIComponent(params.id)
    const { groupSize, random, groups } = await request.json()

    if (groups) {
      // Manual group assignment
      const success = updateGroups(classroomId, groups)
>>>>>>> master
      if (!success) {
        return NextResponse.json({ error: 'Failed to update groups' }, { status: 404 })
      }
    } else if (groupSize) {
      // Random group assignment
<<<<<<< HEAD
      const success = createGroups(params.id, groupSize, random !== false)
=======
      const success = createGroups(classroomId, groupSize, random !== false)
>>>>>>> master
      if (!success) {
        return NextResponse.json({ error: 'Failed to create groups' }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
<<<<<<< HEAD
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success: true, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update groups' }, { status: 500 })
  }
}


=======

    const classroom = getClassroom(classroomId)

    // Emit socket event to notify clients of group changes
    if (global.io) {
      global.io.to(`classroom-${classroomId}`).emit('groups-changed')
    }

    return NextResponse.json({ success: true, classroom })
  })
}
>>>>>>> master
