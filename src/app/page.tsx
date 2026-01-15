'use client';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-white">GitHub README Widget</h1>
          <p className="text-white/40 font-medium">Preview of your dynamic Chelsea.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-[48px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <img
            src="/api/rant"
            alt="Chelsea Rant Widget"
            className="relative rounded-[32px] border border-white/10 shadow-2xl"
          />
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full max-w-2xl">
          <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-widest opacity-50">Usage in README.md</h3>
          <code className="text-blue-400 text-xs break-all">
            ![Chelsea Rant Widget](https://chelsea-rant.vercel.app/api/rant)
          </code>
        </div>
      </div>
    </main>
  );
}
