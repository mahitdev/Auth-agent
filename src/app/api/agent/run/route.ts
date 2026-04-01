import { getSession } from '@auth0/nextjs-auth0';
import { compileAgent } from '@/lib/agent/graph';
import { AgentState } from '@/lib/agent/state';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  try {
    const { threshold } = await req.json();

    const graph = compileAgent();
    // Start LangGraph flow
    // In LangGraph v0.1.0/v0.2.0, invoke takes inputs as an object
    // Also requires thread ID if stateful, but here we run statelessly:
    const initialState: AgentState = {
      userId: session.user.sub,
      threshold,
      issues: [],
      needsApproval: false
    };

    // Note: To properly support suspending/resuming graph, we would use a remote checkpoint saver
    // and invoke with a thread thread_id. Here we invoke and wait for it finish / pause.
    const result = await graph.invoke(initialState, {
      configurable: { thread_id: session.user.sub },
    });

    return new Response(JSON.stringify({ status: 'success', state: result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error("Agent execution failed:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
