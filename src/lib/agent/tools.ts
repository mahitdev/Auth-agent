import { Octokit } from 'octokit';
import { GitHubIssue } from './state';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

/**
 * tool: scanBounties
 * Connects to GitHub manually looking for issues with bounties.
 */
export async function scanBounties(token: string, threshold: number): Promise<GitHubIssue[]> {
  const octokit = new Octokit({ auth: token });
  
  try {
    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: 'is:issue is:open label:bounty',
      per_page: 5,
      sort: 'updated',
      order: 'desc'
    });
    
    return data.items.map(item => ({
      number: item.number,
      title: item.title,
      bounty: threshold + Math.floor(Math.random() * 500), // Simulating bounty amounts for demo purposes
      repo: item.repository_url.replace('https://api.github.com/repos/', '')
    })).filter(issue => issue.bounty >= threshold);
  } catch (error) {
    console.error("Failed to scan bounties", error);
    return [];
  }
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
 * Generates the fix using Gemini LLM.
 */
export async function writeFix(title: string, repo: string): Promise<string> {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are an expert software engineer resolving a GitHub issue.
    Repository: {repo}
    Issue Title: {title}
    
    Please provide ONLY the raw code patch or fix required to resolve the issue. Do not include markdown formatting like \`\`\`
  `);

  const chain = prompt.pipe(llm);
  const result = await chain.invoke({ repo, title });
  
  return result.text ? result.text.toString() : result.content.toString();
}

/**
 * tool: submitPR
 * Creates a branch, commits the fix, and opens a Pull Request.
 */
export async function submitPR(token: string, repo: string, issueNumber: number, fix: string): Promise<string> {
  // In a real scenario this requires fetching the default branch, 
  // creating a tree, creating a commit, updating ref, and opening a PR.
  // Note: True autonomous PR submission with arbitrary diffs requires complex tree manipulation 
  // which is mocked here for the flow demonstration.
  
  console.log(`Submitting PR for issue ${issueNumber} with fix:`, fix.slice(0, 30) + '...');
  
  return `https://github.com/${repo}/pull/${issueNumber + 1}`;
}
