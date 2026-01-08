import { NextRequest, NextResponse } from 'next/server'
import { createGroups, updateGroups, getClassroom } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { groupSize, random, groups } = await request.json()
    
    if (groups) {
      // Manual group assignment
      const success = updateGroups(params.id, groups)
      if (!success) {
        return NextResponse.json({ error: 'Failed to update groups' }, { status: 404 })
      }
    } else if (groupSize) {
      // Random group assignment
      const success = createGroups(params.id, groupSize, random !== false)
      if (!success) {
        return NextResponse.json({ error: 'Failed to create groups' }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success: true, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update groups' }, { status: 500 })
  }
}


