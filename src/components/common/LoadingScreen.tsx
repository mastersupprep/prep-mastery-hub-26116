import { GraduationCap } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Animated graduation cap */}
          <div className="animate-bounce">
            <GraduationCap className="w-16 h-16 text-primary" />
          </div>
          
          {/* Animated path/road */}
          <div className="mt-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Loading your journey...</h2>
          <p className="text-sm text-muted-foreground mt-1">Preparing your learning experience</p>
        </div>
      </div>
    </div>
  );
}
