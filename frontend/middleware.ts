import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedInUser = request.cookies.get('loggedInUser');

  if (!loggedInUser) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/books',
    '/books/:path*',
    '/reviews/:path*',
    '/admin/:path*',
  ],
};
