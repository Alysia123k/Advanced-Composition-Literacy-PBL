import { NextRequest, NextResponse } from 'next/server'

export async function handleApiProxy(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // If BACKEND_API_URL is set (Vercel deployment), proxy to Render backend
  const backendUrl = process.env.BACKEND_API_URL
  if (backendUrl) {
    try {
      const url = `${backendUrl}${request.nextUrl.pathname}${request.nextUrl.search}`
      const body = request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.text()
        : undefined

      const response = await fetch(url, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
        },
        body,
      })

      return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
      })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
    }
  }

  // Local handling (Render deployment)
  return handler()
}
