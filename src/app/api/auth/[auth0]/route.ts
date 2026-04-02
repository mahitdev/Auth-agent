import { handleAuth } from '@auth0/nextjs-auth0';

export const dynamic = 'force-dynamic';

const auth = handleAuth();

export async function GET(req: any, ctx: any) {
  const params = await ctx.params;
  return auth(req, { params });
}

export async function POST(req: any, ctx: any) {
  const params = await ctx.params;
  return auth(req, { params });
}
