import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge-compatible route guard (using middleware.ts filename for compatibility).
 * NextAuth v5 cookie names:
 *   - http:  authjs.session-token
 *   - https: __Secure-authjs.session-token
 */
export function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get('authjs.session-token') ??
    request.cookies.get('__Secure-authjs.session-token');

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    loginUrl.searchParams.set('reason', 'auth');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/campaigns/:path*', '/api/campaigns/:path*'],
};
