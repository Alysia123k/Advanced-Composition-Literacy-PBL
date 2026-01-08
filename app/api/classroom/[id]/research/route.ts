import { NextRequest, NextResponse } from 'next/server'
import { addResearchLink, removeResearchLink, getClassroom } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { url, action } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }
    
    let success = false
    if (action === 'remove') {
      success = removeResearchLink(params.id, url)
    } else {
      success = addResearchLink(params.id, url)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update research links' }, { status: 404 })
    }
    
    const classroom = getClassroom(params.id)
    return NextResponse.json({ success, classroom })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update research links' }, { status: 500 })
  }
}


