
import {
  BookOpen,
  Clock,
  FileText,
  Home,
  PenTool,
  Target,
  Trophy,
  Crown,
  StickyNote
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  currentPage?: string;
  userSubscription?: 'freemium' | 'premium';
  onPageChange?: (page: string) => void;
}

export function AppSidebar({ userSubscription = "freemium" }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "chapter-practice", title: "Chapter wise Practice", icon: PenTool, path: "/chapter-practice" },
    { id: "chapter-pyqs", title: "Chapter wise PYQs", icon: Target, path: "/chapter-pyqs" },
    { id: "mock-tests", title: "Full Mock Papers", icon: FileText, path: "/mock-tests" },
    { id: "pyp-tests", title: "Full PYP Papers", icon: Clock, path: "/pyp-tests" },
    { id: "test-series", title: "Test Series", icon: Trophy, path: "/test-series" },
    { id: "notes", title: "Notes", icon: BookOpen, path: "/notes" },
    { id: "short-notes", title: "Short Notes", icon: StickyNote, path: "/short-notes" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = (path: string) =>
    isActive(path) ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b">
          <Logo size={collapsed ? "sm" : "md"} showText={!collapsed} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    className={getNavCls(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Go Super Button */}
        {userSubscription === 'freemium' && (
          <div className="p-4 mt-auto">
            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              size={collapsed ? "icon" : "default"}
              onClick={() => navigate('/go-super')}
            >
              <Crown className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Go Super</span>}
            </Button>
          </div>
        )}

        {/* Sidebar Toggle */}
        <div className="p-2 border-t">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
