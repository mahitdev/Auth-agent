import { Octokit } from 'octokit';
import { GitHubIssue } from './state';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

/**
 * tool: scanBounties
 * Connects to GitHub manually looking for issues with bounties.
 */
export async function scanBounties(token: string, threshold: number): Promise<GitHubIssue[]> {
  const octokit = new Octokit({ auth: token });
  
  // In a real scenario, this would search globally. 
  // For demo, we'll mock returning a few high/low value issues.
  return [
    { number: 1234, title: "Fix login bug in production", bounty: 75, repo: "owner/repo1" },
    { number: 1235, title: "Migrate database to PostgreSQL", bounty: 600, repo: "owner/repo2" }
  ].filter(issue => issue.bounty >= threshold);
}

/**
 * tool: claimIssue
 * Leaves a comment stating the agent is working on the issue.
 */
export async function claimIssue(token: string, repo: string, issueNumber: number) {
  const octokit = new Octokit({ auth: token });
  const [owner, name] = repo.split('/');
  
  try {
    await octokit.rest.issues.createComment({
      owner,
      repo: name,
      issue_number: issueNumber,
      body: "🤖 Working on this automatically via Autonomous Bounty Hunter Agent... PR incoming."
    });
    console.log(`Claimed issue ${issueNumber} on ${repo}`);
  } catch(e) {
    console.warn(`Failed to claim issue ${issueNumber}`, e);
  }
}

/**
 * tool: writeFix
 * Generates the fix using an LLM.
 */
export async function writeFix(title: string, repo: string): Promise<string> {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are an expert software engineer resolving a GitHub issue.
    Repository: {repo}
    Issue Title: {title}
    
    Please provide ONLY the raw code patch or fix required to resolve the issue. Do not include markdown formatting like \`\`\`
  `);

  const chain = prompt.pipe(llm);
  const result = await chain.invoke({ repo, title });
  
  return result.text || result.content.toString();
}

/**
 * tool: submitPR
 * Creates a branch, commits the fix, and opens a Pull Request.
 */
export async function submitPR(token: string, repo: string, issueNumber: number, fix: string): Promise<string> {
  const octokit = new Octokit({ auth: token });
  const [owner, name] = repo.split('/');
  
  // In a real scenario this requires fetching the default branch, 
  // creating a tree, creating a commit, updating ref, and opening a PR.
  // For demo, we just return a mocked URL.
  
  console.log(`Submitting PR for issue ${issueNumber} with fix:`, fix.slice(0, 30) + '...');
  
  return `https://github.com/${repo}/pull/${issueNumber + 1}`;
}
