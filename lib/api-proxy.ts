import { NextRequest, NextResponse } from 'next/server'

export async function handleApiProxy(
  _request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Always run the API handler in this app so join, tools, and research links work.
  // (Optional: set BACKEND_API_URL to proxy to an external backend instead.)
  return handler()
}
