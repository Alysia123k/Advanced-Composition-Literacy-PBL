import { NextRequest, NextResponse } from 'next/server'
import { toggleTool, getClassroom } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { toolType } = await request.json()
    if (!toolType) {
      return NextResponse.json({ error: 'Tool type required' }, { status: 400 })
    }
    
    const success = toggleTool(params.id, toolType)
    if (!success) {
      return NextResponse.json({ error: 'Failed to toggle tool' }, { status: 404 })
    }
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle tool' }, { status: 500 })
  }
}


