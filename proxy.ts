import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { checkUser } from './app/lib/actions'

const isAdminRoute = createRouteMatcher([
    '/dashboard(.*)'
])

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)', '/sign-up(.*)', '/', '/api(.*)'
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
    
    if (isSellerRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'seller') {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
    }

    if(isSellerProfileRoute(request)){
        const clerkId = (await auth()).sessionClaims?.sub;
        const sellerId = await checkUser(clerkId);
        const pathSegments = new URL(request.url).pathname.split('/');
        const pathSellerId = Number(pathSegments[2]);
        if( !sellerId || sellerId !== pathSellerId){
            const url = new URL('/seller', request.url);
            return NextResponse.redirect(url);
        }  
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(trpc)(.*)'],
}