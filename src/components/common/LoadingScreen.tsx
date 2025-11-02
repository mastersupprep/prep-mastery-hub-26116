export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="relative">
        {/* Animated graduation cap */}
        <div className="animate-bounce">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-4xl">🎓</span>
          </div>
        </div>
        
        {/* Animated path/road */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-slide-in-right"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <p className="text-center mt-32 text-muted-foreground animate-fade-in">
          Preparing your journey...
        </p>
      </div>
    </div>
  );
}
