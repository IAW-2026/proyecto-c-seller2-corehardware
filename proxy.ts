import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { checkUser } from './app/lib/actions'

const isAdminRoute = createRouteMatcher([
    '/dashboard(.*)'
])

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)', '/sign-up(.*)', '/', '/api(.*)', '/deleted-account(.*)'
])

const isSellerRoute = createRouteMatcher([
    '/seller(.*)'
])

const isSellerProfileRoute = createRouteMatcher([
    '/seller/:id(.*)'    
])

export default clerkMiddleware(async (auth, request) => {
    
    
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    if (isAdminRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
    }
    
    const authData = await auth();
    const userRole = authData.sessionClaims?.metadata?.role;

    if (isSellerRoute(request) && userRole && userRole !== 'seller') {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
    }

    if(isSellerProfileRoute(request)){
        const clerkId = authData.sessionClaims?.sub;
        try {
            const sellerId = clerkId ? await checkUser(clerkId) : undefined;
            const pathSegments = new URL(request.url).pathname.split('/');
            const pathSellerId = pathSegments[2] ?? "";
            if (sellerId && sellerId !== pathSellerId) {
                const url = new URL('/seller', request.url);
                return NextResponse.redirect(url);
            }
        } catch (error) {
            console.error('Error verifying seller profile in middleware:', error);
        }
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(trpc)(.*)'],
}