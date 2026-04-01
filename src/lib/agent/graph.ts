import { StateGraph, END, START } from '@langchain/langgraph';
import { getGitHubToken } from '../token-vault';
import { scanBounties, claimIssue, writeFix, submitPR } from './tools';
import { AgentState } from './state';
import { sendTelegramApproval } from '../notifications/telegram';

const graph = new StateGraph<AgentState>({
  channels: {
    userId: null as any,
    threshold: null as any,
    issues: null as any,
    currentIssue: null as any,
    fix: null as any,
    prUrl: null as any,
    needsApproval: null as any
  }
});

graph.addNode('scan', async (state) => {
  const token = await getGitHubToken(state.userId);
  const issues = await scanBounties(token, state.threshold);
  return { ...state, issues, currentIssue: 0 };
});

graph.addNode('claim', async (state) => {
  if (state.issues.length === 0 || state.currentIssue === undefined) return state;
  const token = await getGitHubToken(state.userId);
  const issue = state.issues[state.currentIssue];
  await claimIssue(token, issue.repo, issue.number);
  return state;
});

graph.addNode('write', async (state) => {
  if (state.issues.length === 0 || state.currentIssue === undefined) return state;
  const issue = state.issues[state.currentIssue];
  const fix = await writeFix(issue.title, issue.repo);
  return { ...state, fix };
});

graph.addNode('submit', async (state) => {
  if (state.issues.length === 0 || state.currentIssue === undefined || !state.fix) return state;
  const token = await getGitHubToken(state.userId);
  const issue = state.issues[state.currentIssue];
  const prUrl = await submitPR(token, issue.repo, issue.number, state.fix);
  return { ...state, prUrl };
});

graph.addNode('request_approval', async (state) => {
  const highValue = state.issues.filter(i => i.bounty > 500);
  await sendTelegramApproval(highValue);
  return { ...state, needsApproval: true };
});

// Conditional edge logic
const shouldRequestApproval = (state: AgentState) => {
  if (state.issues.length === 0) return END; // No issues found
  const hasHighValue = state.issues.some(i => i.bounty > 500);
  return hasHighValue ? 'request_approval' : 'claim';
};

graph.addConditionalEdges(START, shouldRequestApproval);
graph.addEdge('request_approval', END);
graph.addEdge('claim', 'write');
graph.addEdge('write', 'submit');
graph.addEdge('submit', END);

export const compileAgent = () => graph.compile();
