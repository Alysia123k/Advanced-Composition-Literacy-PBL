<<<<<<< HEAD
import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
=======
import { NextRequest, NextResponse } from 'next/server'
import { handleApiProxy } from '@/lib/api-proxy'
>>>>>>> master

// This will be handled by a custom server file
export const dynamic = 'force-dynamic'

<<<<<<< HEAD

=======
export async function GET(request: NextRequest) {
  return handleApiProxy(request, async () => {
    return NextResponse.json({ message: 'Socket.IO handled by backend server' })
  })
}
>>>>>>> master
