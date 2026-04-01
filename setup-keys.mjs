import crypto from 'crypto';
import fs from 'fs';

console.log("Generating RSA Keys for Auth0 Token Vault...\n");

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

console.log("✅ Keys generated successfully!");

// Update .env.local
let envFile = "";
try {
  envFile = fs.readFileSync('.env.local', 'utf8');
} catch(e) { /* ignore */ }

envFile = envFile.replace(
  /AUTH0_PRIVATE_KEY="[^"]*"/,
  `AUTH0_PRIVATE_KEY=${JSON.stringify(privateKey)}`
);

fs.writeFileSync('.env.local', envFile);

fs.writeFileSync('public-key.pem', publicKey);

console.log("\n1. Your AUTH0_PRIVATE_KEY has been injected into '.env.local'.");
console.log("2. The public key has been saved to 'public-key.pem'.");
console.log("\nPlease upload 'public-key.pem' to Auth0 Dashboard -> Applications -> Settings -> Advanced Settings -> Certificates.");
