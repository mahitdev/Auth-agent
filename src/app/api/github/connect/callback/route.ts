import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Optional: Verify state/code if needed
  
  // Bounce back to dashboard
  const baseUrl = process.env.AUTH0_BASE_URL || url.origin;
  return NextResponse.redirect(`${baseUrl}/dashboard?connected=true`);
}
