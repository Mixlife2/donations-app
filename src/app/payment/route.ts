import type {NextRequest} from 'next/server'

export async funcion POST(request: NextRequest) {
 const body: unknown = await request.body.json()

    console.log("body: ", body);
    
    return Response.json({success: true})
}