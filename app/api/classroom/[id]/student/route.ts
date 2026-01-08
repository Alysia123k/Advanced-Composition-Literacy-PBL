import { NextRequest, NextResponse } from 'next/server'
import { updateStudentResponse, getClassroom } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { studentId, toolType, data } = await request.json()
    if (!studentId || !toolType) {
      return NextResponse.json({ error: 'Student ID and tool type required' }, { status: 400 })
    }
    
    const success = updateStudentResponse(params.id, studentId, toolType, data)
    if (!success) {
      return NextResponse.json({ error: 'Failed to update response' }, { status: 404 })
    }
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student response' }, { status: 500 })
  }
}


