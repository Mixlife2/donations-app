import type {NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
 const body: unknown = await request.json()

    console.log("body: ", body);
    
    return Response.json({success: true})
}