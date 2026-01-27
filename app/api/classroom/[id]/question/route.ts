import { NextRequest, NextResponse } from 'next/server'
import { addTeacherQuestion, editTeacherQuestion, deleteTeacherQuestion, answerTeacherQuestion, addStudentQuestion, getClassroom } from '@/lib/store'
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
    const { studentId, question, questionId, answer, action } = await request.json()

    let success = false
    if (action === 'add' && question) {
      // Teacher adding a question for students
      success = addTeacherQuestion(classroomId, question)
    } else if (action === 'edit' && questionId && question) {
      // Teacher editing a question
      success = editTeacherQuestion(classroomId, questionId, question)
    } else if (action === 'delete' && questionId) {
      // Teacher deleting a question
      success = deleteTeacherQuestion(classroomId, questionId)
    } else if (action === 'answer' && questionId && answer && studentId) {
      // Teacher answering a student's question
      success = answerTeacherQuestion(classroomId, studentId, questionId, answer)
    } else if (action === 'student-question' && studentId && question) {
      // Student asking a private question to teacher
      success = addStudentQuestion(classroomId, studentId, question)
    } else if (!action && studentId && question) {
      // Backward compatibility: if no action but has studentId and question, treat as student question
      success = addStudentQuestion(classroomId, studentId, question)
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (!success) {
      return NextResponse.json({ error: 'Failed to process question' }, { status: 404 })
    }

    const classroom = getClassroom(classroomId)

    // Emit appropriate socket events
    if (global.io) {
      if (action === 'add' || action === 'edit' || action === 'delete') {
        // Teacher modified questions - notify all clients
        global.io.to(`classroom-${classroomId}`).emit('question-updated')
      } else if (action === 'student-question' || (!action && studentId && question)) {
        // Student asked a question - notify teacher
        global.io.to(`classroom-${classroomId}`).emit('question-asked', { studentId })
        global.io.to(`classroom-${classroomId}`).emit('question-updated')
      } else if (action === 'answer') {
        // Teacher answered a question - notify the student and all clients
        global.io.to(`student-${studentId}`).emit('question-answered', { questionId, answer })
        global.io.to(`classroom-${classroomId}`).emit('question-updated')
      }
    }

    return NextResponse.json({ success, classroom })
  })
}
