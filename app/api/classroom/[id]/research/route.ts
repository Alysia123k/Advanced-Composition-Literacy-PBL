import { NextRequest, NextResponse } from 'next/server'
import { addResearchLink, removeResearchLink, getClassroom } from '@/lib/store'
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
    const { url, action } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }

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

    // Note: Socket events disabled for serverless compatibility
    // In production, real-time updates may not work without persistent connections

    return NextResponse.json({ success, classroom })
  })
}