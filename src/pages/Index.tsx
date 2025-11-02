
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Onboarding from "./Onboarding";
import { Authentication } from "./Authentication";
import { NameSetup } from "./NameSetup";
import { ExamSelection } from "./ExamSelection";
import { CourseSelection } from "./CourseSelection";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

type AppStep = 'onboarding' | 'authentication' | 'name-setup' | 'exam-selection' | 'course-selection' | 'dashboard';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('onboarding');
  const [selectedExam, setSelectedExam] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (user && profile) {
        // User is authenticated and has a profile
        if (profile.selected_exam_id && profile.selected_course_id) {
          navigate('/dashboard', { replace: true });
        } else {
          // User needs to complete exam/course selection
          setCurrentStep('exam-selection');
        }
      } else if (user) {
        // User is authenticated but no profile yet (should be created by trigger)
        setCurrentStep('name-setup');
      } else {
        // User is not authenticated
        setCurrentStep('onboarding');
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  // Show loading screen while checking auth state
  if (authLoading || profileLoading) {
    return <LoadingScreen />;
  }

  if (currentStep === 'onboarding') {
    return <Onboarding />;
  }

  if (currentStep === 'authentication') {
    return <Authentication onBack={() => setCurrentStep('onboarding')} onAuthenticated={() => setCurrentStep('name-setup')} />;
  }

  if (currentStep === 'name-setup') {
    return <NameSetup onContinue={async (name) => { 
      try {
        if (profile) {
          await updateProfile({ name });
        } else {
          // Create profile if it doesn't exist
          const { error } = await supabase
            .from('profiles')
            .insert({ user_id: user?.id, name });
          if (error) throw error;
        }
        setCurrentStep('exam-selection'); 
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }} />;
  }

  if (currentStep === 'exam-selection') {
    return <ExamSelection onBack={() => setCurrentStep('name-setup')} onExamSelected={(examId) => { setSelectedExam(examId); setCurrentStep('course-selection'); }} />;
  }

  if (currentStep === 'course-selection') {
    return <CourseSelection examId={selectedExam} onBack={() => setCurrentStep('exam-selection')} onCourseSelected={async (courseId) => {
      if (profile) {
        await updateProfile({ 
          selected_exam_id: selectedExam, 
          selected_course_id: courseId 
        });
        navigate('/dashboard', { replace: true });
      }
    }} />;
  }

  return null;
};

export default Index;
