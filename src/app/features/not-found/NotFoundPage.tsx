import { Compass } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(96,165,250,0.3)]">
            <Compass className="w-10 h-10 text-blue-400" />
          </div>
          <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full" />
        </div>
        <h2 className="text-3xl font-light tracking-tight mb-3">Page Not Found</h2>
        <p className="text-white/50 mb-2">Error 404</p>
        <p className="text-sm text-white/30 mb-10">The page you're looking for doesn't exist or may have been moved.</p>
        <button onClick={() => navigate("/")} className="w-full py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] text-white font-medium transition-all">
          Take Me Home
        </button>
      </div>
    </main>
  );
}
