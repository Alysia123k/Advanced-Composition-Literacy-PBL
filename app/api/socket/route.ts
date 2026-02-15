import { NextRequest, NextResponse } from 'next/server'
import { handleApiProxy } from '@/lib/api-proxy'

// This will be handled by a custom server file
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return handleApiProxy(request, async () => {
    return NextResponse.json({ message: 'Socket.IO handled by backend server' })
  })
}