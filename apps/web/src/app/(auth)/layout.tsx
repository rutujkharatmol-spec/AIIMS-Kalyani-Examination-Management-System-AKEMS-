export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Animated glowing orbs for background effect */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[30rem] h-[30rem] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
