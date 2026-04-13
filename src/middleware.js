import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
