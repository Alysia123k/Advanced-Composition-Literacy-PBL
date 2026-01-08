import { NextRequest, NextResponse } from 'next/server'
import { getClassroom } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[API] Getting classroom by ID:', params.id)
    const classroomId = decodeURIComponent(params.id)
    console.log('[API] Decoded classroom ID:', classroomId)
    const classroom = getClassroom(classroomId)
    console.log('[API] Classroom found:', !!classroom)
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }
    return NextResponse.json(classroom)
  } catch (error) {
    console.error('[API] Error getting classroom:', error)
    return NextResponse.json({ error: 'Failed to get classroom' }, { status: 500 })
  }
}

