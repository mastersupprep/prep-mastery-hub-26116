
import { Component } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { GoSuper } from "./pages/GoSuper";
import NotFound from "./pages/NotFound";
import { Authentication } from "./pages/Authentication";
import { Dashboard } from "./pages/Dashboard";
import { ChapterPractice } from "./pages/ChapterPractice";
import { ChapterPYQs } from "./pages/ChapterPYQs";
import { MockTests } from "./pages/MockTests";
import { PYPTests } from "./pages/PYPTests";
import { TestSeries } from "./pages/TestSeries";
import { Notes } from "./pages/Notes";
import { ShortNotes } from "./pages/ShortNotes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

// Error boundary component
class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <AppErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Authentication onBack={() => window.history.back()} onAuthenticated={() => window.location.href = '/dashboard'} />} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout currentPage="dashboard"><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/chapter-practice" element={<ProtectedRoute><AppLayout currentPage="chapter-practice"><ChapterPractice /></AppLayout></ProtectedRoute>} />
            <Route path="/chapter-pyqs" element={<ProtectedRoute><AppLayout currentPage="chapter-pyqs"><ChapterPYQs /></AppLayout></ProtectedRoute>} />
            <Route path="/mock-tests" element={<ProtectedRoute><AppLayout currentPage="mock-tests"><MockTests /></AppLayout></ProtectedRoute>} />
            <Route path="/pyp-tests" element={<ProtectedRoute><AppLayout currentPage="pyp-tests"><PYPTests /></AppLayout></ProtectedRoute>} />
            <Route path="/test-series" element={<ProtectedRoute><AppLayout currentPage="test-series"><TestSeries /></AppLayout></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><AppLayout currentPage="notes"><Notes /></AppLayout></ProtectedRoute>} />
            <Route path="/short-notes" element={<ProtectedRoute><AppLayout currentPage="short-notes"><ShortNotes /></AppLayout></ProtectedRoute>} />
            <Route path="/go-super" element={<ProtectedRoute><AppLayout currentPage="go-super"><GoSuper /></AppLayout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </AppErrorBoundary>
);

export default App;
