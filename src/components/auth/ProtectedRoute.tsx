import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user) {
        // Not authenticated, redirect to home/onboarding
        navigate('/', { replace: true });
      } else if (user && profile && (!profile.selected_exam_id || !profile.selected_course_id)) {
        // Authenticated but incomplete setup
        navigate('/', { replace: true });
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  if (authLoading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!profile?.selected_exam_id || !profile?.selected_course_id) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
