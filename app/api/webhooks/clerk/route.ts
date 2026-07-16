import { verifyWebhook} from '@clerk/nextjs/webhooks'
import { clerkClient } from '@clerk/nextjs/server'
import { headers } from 'next/headers';
import { NextRequest } from 'next/server'

export async function POST(req:NextRequest){
    const requestHeaders = await headers();
    const clerk = await clerkClient();
    try{
        const evt = await verifyWebhook(req);
        if(evt.type === 'user.created'){
            const { id } = evt.data;
            await clerk.users.updateUserMetadata(id, {
                publicMetadata: {
                    role: "seller"
                }
            });
        };
        return Response.json({ success: true, message: 'User role assigned' }, { status: 200 });
    } catch(err){
        return new Response('Error: Verification failed', { status: 400 })
    }

}