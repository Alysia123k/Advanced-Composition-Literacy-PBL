'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
        transports: ['websocket'],
      })

      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })
    }

    return () => {
      // Don't disconnect on unmount to maintain connection
    }
  }, [])

  return { socket, isConnected }
}

export function getSocket(): Socket {
  if (!socket) {
    // In serverless environments like Vercel, sockets may not work
    // This is a fallback that won't actually connect
    try {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
        transports: ['websocket'],
      })
    } catch (error) {
      console.warn('Socket connection not available in serverless environment')
      // Return a mock socket object to prevent errors
      socket = {
        emit: () => {},
        on: () => {},
        off: () => {},
        disconnect: () => {},
        connected: false,
        id: null,
      } as any
    }
  }
  return socket!
}


