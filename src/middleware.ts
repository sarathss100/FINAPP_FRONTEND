import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import IVerifyTokenResponse from './types/IVerifyTokenResponse';
import { verifyToken } from './service/authenticationService';

// Constants
const PUBLIC_ROUTES = [
    '/signin',
    '/login',
    '/signup',
    '/',
    '/contact',
    '/charts'
];
const ADMIN_ROUTES = [
    '/admin/dashboard',
    '/admin/user-management',
    '/admin/analytics-reports',
    '/admin/content-management',
    '/admin/system-overview',
    '/admin/system-settings'
];

// Helper Functions
const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.includes(pathname);
const isAdminRoute = (pathname: string) => ADMIN_ROUTES.includes(pathname);

const redirectToDashboard = (userRole: string, requestUrl: string) => {
    const redirectPath = userRole === 'admin' ? '/admin/user-management' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, requestUrl));
};

const handleBlockedUser = (requestUrl: string) => {
    const blockedResponse = NextResponse.redirect(new URL('/blocked', requestUrl));
    blockedResponse.cookies.delete('accessToken');
    blockedResponse.cookies.delete('userMetaData');
    blockedResponse.headers.set('Clear-Storage', 'true');
    return blockedResponse;
};

const clearAuthenticationState = (requestUrl: string) => {
    const errorResponse = NextResponse.redirect(new URL('/login', requestUrl));
    errorResponse.cookies.delete('accessToken');
    errorResponse.cookies.delete('userMetaData');
    errorResponse.headers.set('Clear-Storage', 'true');
    return errorResponse;
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static assets and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/service')
    ) {
        return NextResponse.next();
    }

    // Extract user data and access token
    const extractedUserData = request.cookies.get('userMetaData')?.value;
    const accessToken = request.cookies.get('accessToken')?.value;

    let user = { userId: '', role: '', isLoggedIn: false };
    try {
        if (extractedUserData) {
            user = JSON.parse(extractedUserData);
        }
    } catch (error) {
        console.error('[Middleware] Failed to parse user metadata:', error);
        return clearAuthenticationState(request.url);
    }

    const isAuthenticated = user?.isLoggedIn;

    // Redirect authenticated users from public routes
    if (isAuthenticated && isPublicRoute(pathname)) {
        return redirectToDashboard(user.role || 'user', request.url);
    }

    // Allow access to public routes for unauthenticated users
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    try {
        // Verify token with the backend
        if (isAuthenticated && accessToken) {
            const response = await verifyToken(accessToken);
            const data = response as IVerifyTokenResponse;

            // Handle blocked user
            if (!data.data.status) {
                return handleBlockedUser(request.url);
            }

            // Check role-based access
            if (isAdminRoute(pathname) && user.role !== 'admin') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            } else if (user.role === 'admin') {
                if (isAdminRoute(pathname)) {
                    // If the token is valid, allow access to the protected route
                    return NextResponse.next({ request: { headers: request.headers }});
                } else {
                    return NextResponse.redirect(new URL('/admin/user-management', request.url));
                }
            } 

            // Allow access to protected routes
            return NextResponse.next();
        }

        // Redirect unauthenticated users to login
        return clearAuthenticationState(request.url);
    } catch (error: unknown) {
        console.error('[Middleware] Error:', error instanceof Error ? error.message : 'Something went wrong');
        return clearAuthenticationState(request.url);
    }
}
