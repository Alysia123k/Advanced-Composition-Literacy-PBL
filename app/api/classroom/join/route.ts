import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { getClassroomByCode, addStudent, getAllClassrooms } from '@/lib/store'
=======
import { getClassroomByCode, addStudent, getAllClassrooms, MAX_STUDENTS } from '@/lib/store'
import { handleApiProxy } from '@/lib/api-proxy'

declare global {
  var io: any
}
>>>>>>> master

// Force Node.js runtime to ensure in-memory store persists
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
<<<<<<< HEAD
  try {
    const { joinCode, studentName } = await request.json()
    if (!joinCode || !studentName) {
      return NextResponse.json({ error: 'Join code and student name required' }, { status: 400 })
    }
    
    const normalizedCode = joinCode.toUpperCase().trim()
    console.log('[API] Join attempt:', { joinCode: normalizedCode, studentName })
    
    // Get all classrooms for debugging
    const allClassrooms = getAllClassrooms()
    console.log('[API] Available classrooms:', allClassrooms.map(c => ({
      joinCode: c.joinCode,
      teacherName: c.teacherName,
      studentCount: c.students.length,
    })))
    
    const classroom = getClassroomByCode(normalizedCode)
    
    if (!classroom) {
      console.error('[API] Join failed - code not found:', normalizedCode)
      return NextResponse.json({ 
        error: 'Invalid join code. Please check the code and try again.',
      }, { status: 404 })
    }
    
    console.log('[API] Classroom found:', classroom.classroomId)
    
    const student = addStudent(classroom.classroomId, studentName)
    if (!student) {
      return NextResponse.json({ error: 'Student name already exists' }, { status: 409 })
    }
    
    console.log('[API] Student added successfully:', student.studentId)
    
    return NextResponse.json({ classroom, student })
  } catch (error) {
    console.error('[API] Join error:', error)
    return NextResponse.json({ error: 'Failed to join classroom' }, { status: 500 })
  }
}

=======
  return handleApiProxy(request, async () => {
    try {
      const { joinCode, studentName } = await request.json()
      if (!joinCode || !studentName) {
        return NextResponse.json({ error: 'Join code and student name required' }, { status: 400 })
      }

      const normalizedCode = joinCode.toUpperCase().trim()
      console.log('[API] Join attempt:', { joinCode: normalizedCode, studentName })

      // Get all classrooms for debugging
      const allClassrooms = getAllClassrooms()
      console.log('[API] Available classrooms:', allClassrooms.map(c => ({
        joinCode: c.joinCode,
        teacherName: c.teacherName,
        studentCount: c.students.length,
      })))

      const classroom = getClassroomByCode(normalizedCode)

      if (!classroom) {
        console.error('[API] Join failed - code not found:', normalizedCode)
        return NextResponse.json({
          error: 'Invalid join code. Please check the code and try again.',
        }, { status: 404 })
      }

      if (classroom.students.length >= MAX_STUDENTS) {
        return NextResponse.json({
          error: `This classroom is full. Maximum ${MAX_STUDENTS} students allowed.`,
        }, { status: 403 })
      }

      console.log('[API] Classroom found:', classroom.classroomId)

      const student = addStudent(classroom.classroomId, studentName)
      if (!student) {
        return NextResponse.json({ error: 'Student name already exists' }, { status: 409 })
      }

      console.log('[API] Student added successfully:', student.studentId)

      // Emit socket event to notify clients of the new student
      if (global.io) {
        global.io.to(`classroom-${classroom.classroomId}`).emit('student-list-updated')
      }

      return NextResponse.json({ classroom, student })
    } catch (error) {
      console.error('[API] Join error:', error)
      return NextResponse.json({ error: 'Failed to join classroom' }, { status: 500 })
    }
  })
}
>>>>>>> master
