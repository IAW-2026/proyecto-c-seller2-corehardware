import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher([
    '/dashboard(.*)'
])

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)', '/sign-up(.*)', '/', '/api(.*)'
])

const isSellerRoute = createRouteMatcher([
    '/seller(.*)'
])

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
    if (isAdminRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
    }
    
    if (isSellerRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'seller') {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}