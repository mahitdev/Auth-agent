import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  const domain = (process.env.AUTH0_ISSUER_BASE_URL || '').replace('https://', '');

  // Redirect to Auth0's Connected Accounts endpoint
  const connectUri = `https://${domain}/me/v1/connected-accounts/initiate?` +
    `connection=github&` +
    `redirect_uri=${encodeURIComponent(process.env.AUTH0_BASE_URL + '/api/github/connect/callback')}&` + // callback can be anywhere
    `scope=repo+read:user`;

  return Response.redirect(connectUri);
}
