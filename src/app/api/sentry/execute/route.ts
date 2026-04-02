import { NextResponse } from 'next/server';
import { initiateCIBA, pollCIBAToken } from '@/lib/auth0-ciba';
import { getGitHubToken } from '@/lib/token-vault';
import { claimIssue, scanBounties, submitPR } from '@/lib/agent/tools';

export async function POST(req: Request) {
  try {
    const { userId, action, payload } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
    }

    console.log(`[SENTRY] Received delegated execution request from OpenClaw: ${action}`);

    // Read actions (low privilege)
    if (action === 'scanBounties') {
      const token = await getGitHubToken(userId);
      const issues = await scanBounties(token, payload.threshold || 50);
      return NextResponse.json({ success: true, result: issues });
    }

    // Write actions (High privilege step-up)
    if (action === 'claimIssue') {
      const { repo, issueNumber, bountyAmount } = payload;

      // Always trigger CIBA for claims or only for high value? The flow says: 
      // "If OpenClaw tries to delete a repository or send a high-value payment, the Sentry triggers Auth0 Async Auth (CIBA)."
      if (bountyAmount && bountyAmount >= 500) {
        const bindingMsg = `Approve high-value claim on ${repo} #${issueNumber} for $${bountyAmount}?`;
        const { auth_req_id } = await initiateCIBA(userId, action, bindingMsg);
        
        // Wait for user to approve on their device
        const stepUpToken = await pollCIBAToken(auth_req_id);
        console.log(`[SENTRY] CIBA Step-Up successful. Authorized with token: ${stepUpToken}`);
      } else {
        console.log(`[SENTRY] Low value bounty, bypassing step-up.`);
      }

      // Actually fetch the token and do the action
      const token = await getGitHubToken(userId);
      await claimIssue(token, repo, issueNumber);
      return NextResponse.json({ success: true, message: `Successfully claimed issue #${issueNumber}` });
    }

    if (action === 'submitPR') {
      const { repo, issueNumber, fixContent } = payload;
      
      const bindingMsg = `Approve submitting PR for ${repo} #${issueNumber}?`;
      const { auth_req_id } = await initiateCIBA(userId, action, bindingMsg);
      await pollCIBAToken(auth_req_id);
      
      const token = await getGitHubToken(userId);
      const prUrl = await submitPR(token, repo, issueNumber, fixContent);
      return NextResponse.json({ success: true, prUrl });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    console.error('[SENTRY error]', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
