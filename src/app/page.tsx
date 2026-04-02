'use client';

import { ArrowRight, Bot, Code2, ShieldAlert, Sparkles, Terminal, Loader2 } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      window.location.href = '/api/auth/login';
    }, 1200); // 1.2s delay for a premium loading transition
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-[#020617] text-slate-100 flex flex-col justify-center">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[30%] -left-[10%] w-[70rem] h-[70rem] rounded-full bg-indigo-600 blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[60rem] h-[60rem] rounded-full bg-fuchsia-600 blur-[160px]" 
        />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="space-y-10 max-w-4xl text-center mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm font-semibold tracking-wider shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>The first fully autonomous bounty hunting agent</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-[5.5rem] font-black tracking-tight text-white pb-2 leading-tight drop-shadow-2xl"
          >
            Sleep while you <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              earn crypto.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Connect your GitHub. Set your threshold. Our sovereign agent scans open issues, claims them, and submits PRs completely locally.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={handleLogin}
              disabled={isNavigating || isLoading}
              className={clsx(
                "group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]",
                isNavigating ? "bg-indigo-600 text-white shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)]" : "bg-white text-slate-950 glow-primary hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.8)]"
              )}
            >
              {!isNavigating && <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
              
              <span className="relative z-10">
                {isNavigating ? "Authenticating Session..." : "Initialize Session"}
              </span>
              
              {isNavigating ? (
                <Loader2 className="relative z-10 w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
            
            <a
              href="https://github.com/mahitdev/Auth-agent"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 glass text-white rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Source Code</span>
            </a>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-32 relative z-10"
        >
          <div className="group p-8 rounded-3xl glass hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform duration-500 border border-indigo-500/30">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Zero-Knowledge Storage</h3>
            <p className="text-slate-400 leading-relaxed text-base">
              The OpenClaw node runs completely locally. The Next.js Sentry acts as an identity bridge without seeing your underlying GitHub provider keys.
            </p>
          </div>

          <div className="group p-8 rounded-3xl glass hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(217,70,239,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform duration-500 border border-fuchsia-500/30">
              <ShieldAlert className="w-8 h-8 text-fuchsia-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">CIBA Step-Up Auth</h3>
            <p className="text-slate-400 leading-relaxed text-base">
              High-value code modifications instantly pause OpenClaw and trigger a cryptographic Auth0 push-notification to your phone for approval.
            </p>
          </div>

          <div className="group p-8 rounded-3xl glass hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 max-group-hover:scale-110 transition-transform duration-500 border border-cyan-500/30">
              <Terminal className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">LangGraph Engine</h3>
            <p className="text-slate-400 leading-relaxed text-base">
              Engineered with LangGraph and Vercel AI SDK. Build complex sub-graphs to deeply analyze PRs, completely automated and completely secure.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
