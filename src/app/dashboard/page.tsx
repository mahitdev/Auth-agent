'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { Play, Settings2, Activity, AlertCircle, CheckCircle2, RefreshCw, LogOut, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [threshold, setThreshold] = useState(50);
  const [connectedServices, setConnectedServices] = useState({ github: false });
  const [activityLog, setActivityLog] = useState<{time: string, msg: string, type?: 'success'|'info'|'warning'}[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const addLog = (msg: string, type: 'success'|'info'|'warning' = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLog(prev => [{ time, msg, type }, ...prev]);
  };

  const handleRunAgent = async () => {
    setAgentStatus('running');
    addLog(`Scanning GitHub for bounties ≥ $${threshold}...`);
    try {
      const res = await fetch('/api/agent/run', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.state?.needsApproval) {
          setAgentStatus('paused');
          addLog("High-value bouty found! Requested Telegram Approval.", 'warning');
        } else {
          setAgentStatus('idle');
          addLog("Agent finished resolving issues.", 'success');
        }
      } else {
        setAgentStatus('idle');
        addLog(`Error: ${data.error}`, 'warning');
      }
    } catch (e: any) {
      setAgentStatus('idle');
      addLog(`Failed to run agent.`, 'warning');
    }
  };

  if (isLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="animate-pulse flex items-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        Loading...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {/* Navbar Minimal */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">BountyHunter</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <img src={user.picture || ''} alt="avatar" className="w-6 h-6 rounded-full" />
            <span className="hidden sm:block">{user.email}</span>
          </div>
          <a href="/api/auth/logout" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Agent Command Center</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Services Card */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-colors" />
            
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Connected Services</h2>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`relative w-2 h-2 rounded-full ${connectedServices.github ? 'bg-green-500' : 'bg-red-500'}`}>
                  {connectedServices.github && <div className="absolute inset-0 bg-green-500 blur-sm" />}
                </div>
                <span className="font-medium">GitHub Account</span>
              </div>
              {connectedServices.github ? (
                <a href="/api/github/disconnect" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 bg-red-400/10 rounded-lg">Disconnect</a>
              ) : (
                <a href="/api/github/connect" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Link Account
                </a>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Via Token Vault Privileged Worker. Check your Auth0 dashboard for deep revocation.
            </p>
          </div>

          {/* Controls Card */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-3xl -z-10 group-hover:bg-fuchsia-500/20 transition-colors" />
            
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-5 h-5 text-fuchsia-400" />
              <h2 className="text-xl font-semibold text-white">Runtime Controls</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">Minimum Bounty Threshold ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input 
                  type="number" 
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="bg-slate-950 border border-white/10 px-8 py-3 rounded-xl w-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-shadow"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleRunAgent}
                disabled={agentStatus === 'running'}
                className="flex-[2] bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {agentStatus === 'running' ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
                {agentStatus === 'running' ? 'Agent Scanning...' : 'Run Agent Now'}
              </button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/10">
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Unified Terminal Log */}
        <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] flex flex-col h-80">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h2 className="text-lg font-mono font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="w-5 h-5" /> Activity Stream
            </h2>
            <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full ${agentStatus === 'running' ? 'bg-fuchsia-500 animate-pulse' : agentStatus === 'paused' ? 'bg-yellow-500' : 'bg-slate-600'}`} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto font-mono text-sm space-y-3">
            {activityLog.length === 0 ? (
              <div className="text-slate-600 italic h-full flex items-center justify-center">Agent is idle. Waiting for commands.</div>
            ) : (
              activityLog.map((log, i) => (
                <div key={i} className="flex gap-3 animate-in slide-in-from-left fade-in">
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span className={`${log.type === 'success' ? 'text-green-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {log.type === 'success' && <CheckCircle2 className="inline w-4 h-4 mr-1 -mt-0.5" />}
                    {log.type === 'warning' && <AlertCircle className="inline w-4 h-4 mr-1 -mt-0.5" />}
                    {log.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
