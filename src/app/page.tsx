'use client';

import { ArrowRight, Bot, Code2, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-950">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 relative">
        <div className="space-y-8 max-w-4xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium tracking-wide shadow-inner shadow-white/5">
            <Sparkles className="w-4 h-4" />
            <span>The first fully autonomous bounty hunting agent</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 pb-2">
            Sleep while you <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">earn crypto</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
            Connect your GitHub. Set your threshold. Our advanced LLM agent scans open issues, claims them, writes the fix, and submits the PR autonomously.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/api/auth/login" 
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Start Earning Now</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Terminal className="w-5 h-5 text-slate-400" />
              <span>View the Docs</span>
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 relative z-10" id="how-it-works">
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Flawless Code Generation</h3>
            <p className="text-slate-400 leading-relaxed">
              Powered by LangGraph and GPT-4o, the agent analyzes the exact context of the issue and generates precise diffs that reviewers love.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hover:shadow-2xl hover:shadow-fuchsia-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-7 h-7 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Privileged Worker Model</h3>
            <p className="text-slate-400 leading-relaxed">
              Built on Auth0's Token Vault. Your raw GitHub tokens never touch our database. Revoke access instantly with one click.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hover:shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Step-Up Approval</h3>
            <p className="text-slate-400 leading-relaxed">
              High-value bounties (> $500) trigger a Telegram notification for human-in-the-loop review before the PR is submitted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
