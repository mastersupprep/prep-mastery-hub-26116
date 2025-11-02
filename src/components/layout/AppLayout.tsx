import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useProfile } from "@/hooks/useProfile";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { profile } = useProfile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar userSubscription={profile?.subscription || 'freemium'} />
        <div className="flex-1 flex flex-col">
          <TopBar userName={profile?.name || 'User'} />
          <main className="flex-1">
            <div className="p-6 bg-muted/30">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}