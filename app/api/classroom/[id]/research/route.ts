import { NextRequest, NextResponse } from 'next/server'
import { addResearchLink, removeResearchLink, getClassroom } from '@/lib/store'
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
=======
  return handleApiProxy(request, async () => {
    const classroomId = decodeURIComponent(params.id)
>>>>>>> master
    const { url, action } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }
<<<<<<< HEAD
    
    let success = false
    if (action === 'remove') {
      success = removeResearchLink(params.id, url)
    } else {
      success = addResearchLink(params.id, url)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update research links' }, { status: 404 })
    }
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update research links' }, { status: 500 })
  }
}


=======

    let success = false
    if (action === 'remove') {
      success = removeResearchLink(classroomId, url)
    } else {
      success = addResearchLink(classroomId, url)
    }

    if (!success) {
      return NextResponse.json({ error: 'Failed to update research links' }, { status: 404 })
    }

    const classroom = getClassroom(classroomId)

    // Emit socket event to notify clients of research link changes
    if (global.io) {
      global.io.to(`classroom-${classroomId}`).emit('research-links-updated')
    }

    return NextResponse.json({ success, classroom })
  })
}
>>>>>>> master
