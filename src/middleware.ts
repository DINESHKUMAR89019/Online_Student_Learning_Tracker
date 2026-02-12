import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    console.log('[Middleware] Path:', pathname, '| Has token:', !!token);

    // Public routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If no token and trying to access protected route
    if (!token && !isPublicRoute && pathname !== '/') {
        console.log('[Middleware] No token, redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If has token, verify it
    if (token) {
        const payload = verifyToken(token);
        console.log('[Middleware] Token payload:', payload);

        // Invalid token
        if (!payload) {
            console.log('[Middleware] Invalid token, clearing and redirecting to /login');
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }

        // Redirect from public routes to dashboard if already logged in
        if (isPublicRoute) {
            const dashboardUrl = payload.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
            console.log('[Middleware] Already logged in, redirecting to:', dashboardUrl);
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }

        // Role-based access control
        if (pathname.startsWith('/teacher') && payload.role !== 'teacher') {
            return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }
        if (pathname.startsWith('/student') && payload.role !== 'student') {
            return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// Force Node.js runtime instead of Edge runtime for JWT support
export const runtime = 'nodejs';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
