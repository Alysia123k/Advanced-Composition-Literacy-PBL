import { NextRequest, NextResponse } from 'next/server'
import { handleApiProxy } from '@/lib/api-proxy'

// This is a debug endpoint to check if classrooms exist
// Only available in development
export async function GET(request: NextRequest) {
  return handleApiProxy(request, async () => {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
    }

    // Import dynamically to get fresh state
    const { getAllClassrooms } = await import('@/lib/store')
    const classrooms = getAllClassrooms()

    return NextResponse.json({
      count: classrooms.length,
      classrooms: classrooms.map(c => ({
        classroomId: c.classroomId,
        teacherName: c.teacherName,
        joinCode: c.joinCode,
        studentCount: c.students.length,
      })),
    })
  })
}


