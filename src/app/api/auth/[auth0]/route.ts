import { handleAuth } from '@auth0/nextjs-auth0';

export const dynamic = 'force-dynamic';

function checkEnv() {
  if (!process.env.AUTH0_SECRET || !process.env.AUTH0_BASE_URL) {
    return new Response(
      `<html><body style="font-family: sans-serif; background: #020617; color: white; padding: 3rem; text-align: center;">` +
      `<h1>Wait! You need to configure Vercel Environment Variables</h1>` +
      `<p style="font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin: 1rem auto;">` +
      `The 500 error is gone, but Auth0 crashed because your Vercel deployment has no idea what your Auth0 keys are. Vercel wiped out your local keys during the last deployment step.</p>` +
      `<br/>` +
      `<div style="text-align: left; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 2rem; border-radius: 12px; border: 1px solid #334155;">` +
      `<b>Please go to Vercel.com -> Settings -> Environment Variables and add these exactly:</b>` +
      `<ul><li><b>AUTH0_SECRET</b> (needs to be a random 32-character string)</li>` +
      `<li><b>AUTH0_BASE_URL</b> (set exactly to: https://auth-agent.vercel.app)</li>` +
      `<li><b>AUTH0_ISSUER_BASE_URL</b> (your auth0 tenant URL)</li>` +
      `<li><b>AUTH0_CLIENT_ID</b></li>` +
      `<li><b>AUTH0_CLIENT_SECRET</b></li></ul>` +
      `</div><br/><h3>After adding them, hit Redeploy in Vercel.</h3></body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
  return null;
}

let auth: any;

export async function GET(req: any, ctx: any) {
  const err = checkEnv();
  if (err) return err;
  
  if (!auth) auth = handleAuth();
  
  const params = await ctx.params;
  return auth(req, { params });
}

export async function POST(req: any, ctx: any) {
  const err = checkEnv();
  if (err) return err;

  if (!auth) auth = handleAuth();

  const params = await ctx.params;
  return auth(req, { params });
}
