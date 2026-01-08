import { NextRequest, NextResponse } from 'next/server'
import { getClassroom } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classroom = getClassroom(params.id)
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }
    return NextResponse.json(classroom)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get classroom' }, { status: 500 })
  }
}

