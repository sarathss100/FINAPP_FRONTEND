import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import apiClient from './lib/apiClient';
import { useUserStore } from './stores/store';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static assets and public routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('./api')
    ) {
        return NextResponse.next();
    }

    // Public routes that don't require authentication 
    const publicRoutes = ['/login', '/signup', '/home'];

    console.log(request.cookies.get('accessToken')?.value);

    // Get the user state from the Zustand store
    const { user, logout } = useUserStore.getState();
    const isAuthenticated = user?.isLoggedIn;
    
    // Redirect authenticated users from public routes to the dashboad
    if (isAuthenticated && publicRoutes.includes(pathname)) {
        const role = user?.role || 'user';
        const redirectPath = role === 'admin' ? '/admin/dashboard' : '/dashoard';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Allow access to public routes for unauthenticated users
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    try {
        // If the user is authenticated in the Zustand store, verify the token with the backend
        if (isAuthenticated) {
            await apiClient.post('api/v1/auth/verify-token');

            // If the token is valid, allow access to the protected route
            return NextResponse.next();
        }

        // If the user is not authenticated, redirect to the login page
        return NextResponse.redirect(new URL('/login', request.url));
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : `Soemthing went wrong`);

        // If the token verification fails
        logout();

        // If the token is invalid or expired, redirect to the login page
        return NextResponse.redirect(new URL('/signup', request.url));
    }
}

