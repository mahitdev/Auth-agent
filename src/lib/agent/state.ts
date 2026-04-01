export interface GitHubIssue {
  number: number;
  title: string;
  bounty: number;
  repo: string;
}

export interface AgentState {
  userId: string;
  threshold: number;
  issues: GitHubIssue[];
  currentIssue?: number;
  fix?: string;
  prUrl?: string;
  needsApproval: boolean;
}
