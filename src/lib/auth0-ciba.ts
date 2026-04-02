import axios from 'axios';

const AUTH0_DOMAIN = (process.env.AUTH0_ISSUER_BASE_URL || '').replace('https://', '');
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
// const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;

export async function initiateCIBA(userId: string, actionDetails: string, bindingMessage: string): Promise<{ auth_req_id: string, expires_in: number }> {
  // In a real CIBA configuration:
  // We would POST to https://${AUTH0_DOMAIN}/bc-authorize
  // using client credentials or an access token.
  
  console.log(`[CIBA SENTRY] 🔐 Initiating async Auth (CIBA) for user ${userId}`);
  console.log(`[CIBA SENTRY] Action Details: ${actionDetails}`);
  console.log(`[CIBA SENTRY] Binding Message to User's Phone: "${bindingMessage}"`);
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    auth_req_id: `req_${Math.random().toString(36).substring(2, 11)}`,
    expires_in: 120
  };
}

export async function pollCIBAToken(authReqId: string): Promise<string> {
  // We would poll https://${AUTH0_DOMAIN}/oauth/token with grant_type=urn:openid:params:grant-type:ciba
  
  console.log(`[CIBA SENTRY] ⏳ Waiting for user approval on their authenticated device (auth_req_id: ${authReqId})...`);
  
  // Simulate user taking 3 seconds to pull out their phone, read the prompt, and click "Approve"
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log(`[CIBA SENTRY] ✅ User approved the action via push notification!`);
  
  return `step_up_token_${Math.random().toString(36).substring(2, 11)}`;
}
