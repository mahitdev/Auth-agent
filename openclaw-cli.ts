/**
 * OpenClaw CLI - The Autonomous Agent "Brain"
 * Runs locally, manages memory in SQLite, and delegates API execution
 * to the Sentry to never hold the actual OAuth Access Tokens.
 */
import readline from 'readline';
import { saveInteraction, getHistory } from './src/lib/openclaw/db';

const SENTRY_API_URL = 'http://localhost:3000/api/sentry/execute';
// Hardcoded user ID for demonstration. Normally this is established during desktop login.
const MOCK_USER_ID = 'local_user_123';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

async function executeAction(action: string, payload: any) {
  console.log(`\n[OPENCLAW] 📡 Dispatching execution request to Sentry (${action})...`);
  try {
    const res = await fetch(SENTRY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: MOCK_USER_ID,
        action,
        payload
      })
    });
    
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Sentry returned error: ${err}`);
    }
    
    return await res.json();
  } catch (err: any) {
    console.error(`[OPENCLAW] ❌ Sentry execution failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function runLocalAgent() {
  console.log("==================================================");
  console.log(" 🦅 OpenClaw Agent (Brain) - Local Secure Session");
  console.log("==================================================");
  console.log("Loaded local memory (SQLite). Not holding any tokens.");
  
  while (true) {
    const prompt = await askQuestion('\n> ');
    if (prompt.toLowerCase() === 'exit') break;
    
    let aiResponse = "";
    
    // Simulate simple intent routing locally
    if (prompt.includes('scan') && prompt.includes('bounties')) {
      aiResponse = `I will ask the Sentry to scan for bounties locally...`;
      console.log(`[OPENCLAW Internal] ${aiResponse}`);
      
      const scanRes = await executeAction('scanBounties', { threshold: 500 });
      if (scanRes.success) {
        aiResponse = `Found ${scanRes.result.length} bounties: \n${JSON.stringify(scanRes.result, null, 2)}`;
      } else {
        aiResponse = `Failed to scan: ${scanRes.error}`;
      }
      
    } else if (prompt.includes('claim')) {
      aiResponse = `I will ask the Sentry to claim the high-value issue...`;
      console.log(`[OPENCLAW Internal] ${aiResponse}`);
      
      // Try to claim a mock high value bounty
      const claimRes = await executeAction('claimIssue', {
        repo: 'mahitdev/demo-repo',
        issueNumber: 42,
        bountyAmount: 1000 // High value, will trigger CIBA Step-up
      });
      
      if (claimRes.success) {
        aiResponse = `Successfully securely claimed issue via Sentry. Output: ${claimRes.message}`;
      } else {
        aiResponse = `Failed to claim: ${claimRes.error}`;
      }
      
    } else {
       aiResponse = "I am OpenClaw. I process locally. Ask me to 'scan bounties' or 'claim'.";
    }
    
    console.log(`\n[OPENCLAW] ${aiResponse}`);
    
    // Save to local memory
    saveInteraction(prompt, aiResponse, { context: 'cli' });
  }

  console.log("\nShutting down OpenClaw...");
  rl.close();
}

runLocalAgent().catch(console.error);
