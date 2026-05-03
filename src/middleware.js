import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isLoggedIn = !!req.cookies.get('__session');

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (isLoginPage) {
    const res = NextResponse.next();
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
