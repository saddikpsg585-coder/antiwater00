import { NextResponse } from 'next/server';
// import { adminDb } from '@/lib/firebase/admin';

// POST: Triggered internally to dispatch data, or externally to receive results
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check header for secret webhook token (SOP 5.4)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET || 'dev-secret'}`) {
      return NextResponse.json({ error: 'Unauthorized webhook access' }, { status: 401 });
    }

    // Branch logic based on whether this is a Dispatch or a Receive
    if (body.action === 'dispatch') {
      // 1. We receive a dispatch request from our own frontend component
      // 2. We send it out to an external analysis engine
      console.log('Dispatching sample payload to external system:', body.payload);
      
      // Mocking external response
      const externalMockResponse = {
        point_id: body.payload.point_id,
        status: 'analyzed',
        compliance: true,
        recommendation: 'Continue routine monitoring.',
      };

      // 3. We'd store the callback result in Firestore
      // await adminDb.collection('analysisResults').add(externalMockResponse);
      
      return NextResponse.json({ message: 'Dispatched successfully', analysis: externalMockResponse });
    } 
    
    if (body.action === 'receive') {
      // Example of async callback receiver saving to DB
      console.log('Received analysis data from external service:', body.data);
      // await adminDb.collection('analysisResults').add(body.data);
      return NextResponse.json({ status: 'Acknowledged' });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
