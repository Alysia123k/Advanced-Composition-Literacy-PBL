import { NextRequest, NextResponse } from 'next/server'
import { addTeacherQuestion, editTeacherQuestion, deleteTeacherQuestion, answerTeacherQuestion, addStudentQuestion, getClassroom } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}


