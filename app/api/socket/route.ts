import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

// This will be handled by a custom server file
export const dynamic = 'force-dynamic'
