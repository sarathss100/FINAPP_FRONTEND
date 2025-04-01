import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import apiClient from './lib/apiClient';
import IVerifyTokenResponse from './types/IVerifyTokenResponse';

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
    const publicRoutes = ['/signin', '/login', '/signup', '/'];

    // Admin-only routes
    const adminRoutes = ['/admin/dashboard', '/admin/user-management', '/admin/analytics-reports', '/admin/content-management', '/admin/system-overview', '/admin/system-settings'];

    const extractedUserData: string | undefined = request.cookies.get('userMetaData')?.value;

    let user = {userId: '', role: '', isLoggedIn: false };
    if (extractedUserData) {
        user = JSON.parse(extractedUserData!);
    }

    const isAuthenticated = user?.isLoggedIn;
    const accessToken = request.cookies.get('accessToken')?.value;

    // Redirect authenticated users from public routes to the dashboad
    if (isAuthenticated && publicRoutes.includes(pathname)) {
        const role = user?.role || 'user';
        const redirectPath = role === 'admin' ? '/admin/dashboard' : '/dashboard';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    } 

    // Allow access to public routes for unauthenticated users
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    try {
        
        // If the user is authenticated in the Zustand store, verify the token with the backend
        if (isAuthenticated) {
            
            const response = await apiClient.post('api/v1/auth/verify-token', { accessToken }, {
                headers: {
                    Cookie: `{"accessToken":"${accessToken}"}`
                }
            });

            const data = response.data as IVerifyTokenResponse;
            console.log("Front End Middile Ware", data.data.status);

            if (!data.data.status) {
                // Send logout request to backend 
                await apiClient.post(`api/v1/auth/signout`);
            }
            
                // if (data.data.decodedData.newAccessToken) {
                //     const nextResponse = NextResponse.next();
                //     nextResponse.cookies.set('accessToken', data.data.decodedData.newAccessToken, {
                //         httpOnly: true,
                //         secure: process.env.NODE_ENV === 'production' ? true : false,
                //         sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                //         maxAge: 15 * 60 * 1000,
                //     });
                // }

                const role = user?.role || 'user';

                if (adminRoutes.includes(pathname) && role !== 'admin') {
                    // Redirect non-admin users attempting to access admin routes
                    return NextResponse.redirect(new URL('/unauthorized', request.url));
                } else if (role === 'admin') {
                    if (adminRoutes.includes(pathname)) {
                        // If the token is valid, allow access to the protected route
                        return NextResponse.next({ request: { headers: request.headers }});
                    } else {
                        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                    }
                }
            
                // If the token is valid, allow access to the protected route
                return NextResponse.next({ request: { headers: request.headers }});

        }

        // If the user is not authenticated, redirect to the login page
        return NextResponse.redirect(new URL('/login', request.url));
    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : `Soemthing went wrong`);

        // If the token is invalid or expired, redirect to the login page
        return NextResponse.redirect(new URL('/signup', request.url));
    }
}
