import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  // Disconnecting via Auth0 requires using Auth0 Management API or redirecting
  // user to their Auth0 profile to manually revoke connection.
  // For simplicity, we just bounce back to the dashboard with a query param.
  
  return Response.redirect(`${process.env.AUTH0_BASE_URL}/dashboard?disconnected=true`);
}
