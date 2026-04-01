import jwt from 'jsonwebtoken';
import axios from 'axios';

const PRIVATE_KEY = process.env.AUTH0_PRIVATE_KEY || '';
const AUTH0_DOMAIN = (process.env.AUTH0_ISSUER_BASE_URL || '').replace('https://', '');
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const AUTH0_CREDENTIAL_ID = process.env.AUTH0_CREDENTIAL_ID!;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Uses Privileged Worker exchange to get short-lived tokens from Auth0 
 * for the user's connected GitHub account.
 */
export async function getGitHubToken(userId: string): Promise<string> {
  const now = Date.now();
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  // Sign short-lived JWT (60 seconds TTL)
  const subjectToken = jwt.sign(
    { sub: userId, aud: `https://${AUTH0_DOMAIN}/` },
    PRIVATE_KEY,
    {
      algorithm: 'RS256',
      issuer: AUTH0_CLIENT_ID,
      expiresIn: 60,
      header: {
        alg: 'RS256',
        typ: 'token-vault-req+jwt'  // CRITICAL: Not standard "JWT"
      }
    }
  );

  // Exchange for GitHub access token
  const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    grant_type: 'urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token',
    subject_token: subjectToken,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    connection: 'github',
    client_id: AUTH0_CLIENT_ID,
    client_credential_id: AUTH0_CREDENTIAL_ID
  });

  const accessToken = response.data.access_token;
  cachedToken = accessToken;
  tokenExpiresAt = now + (3600 * 1000); // Tokens generally valid for ~1 hour

  return accessToken;
}
