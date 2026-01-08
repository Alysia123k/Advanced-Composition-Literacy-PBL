import { NextRequest, NextResponse } from 'next/server'
import { createClassroom, getClassroom } from '@/lib/store'

// Force Node.js runtime to ensure in-memory store persists
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { teacherName } = await request.json()
    if (!teacherName) {
      return NextResponse.json({ error: 'Teacher name required' }, { status: 400 })
    }
    
    const classroom = createClassroom(teacherName)

    // Verify the classroom was created and is retrievable
    const verify = getClassroom(classroom.classroomId)
    if (!verify) {
      console.error('[API] Classroom created but not found in store:', classroom.classroomId)
      return NextResponse.json({ error: 'Failed to persist classroom' }, { status: 500 })
    }
    
    console.log('[API] Classroom created successfully:', {
      classroomId: classroom.classroomId,
      joinCode: classroom.joinCode,
      teacherName: classroom.teacherName,
      verified: !!verify,
    })
    
    return NextResponse.json(classroom)
  } catch (error) {
    console.error('[API] Error creating classroom:', error)
    return NextResponse.json({ error: 'Failed to create classroom' }, { status: 500 })
  }
}
