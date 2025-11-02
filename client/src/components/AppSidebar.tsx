import { Home, Building2, Bed, Users, LogOut, User, Bell, FileText, FileCheck, Utensils, CheckSquare, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

interface AppSidebarProps {
  role: "student" | "warden" | "admin";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const [location, setLocation] = useLocation();

  const studentItems = [
    { title: "Dashboard", url: "/student", icon: Home },
    { title: "Room Allotment", url: "/student/allotment", icon: Bed },
    { title: "Room Swap", url: "/student/room-swap", icon: FileText },
    { title: "Leave Application", url: "/student/leave", icon: FileCheck },
    { title: "Mess Change", url: "/student/mess-change", icon: Utensils },
    { title: "Notifications", url: "/student/notifications", icon: Bell },
  ];

  const wardenItems = [
    { title: "Dashboard", url: "/warden", icon: Home },
    { title: "Students", url: "/warden/students", icon: Users },
    { title: "Approvals", url: "/warden/approvals", icon: CheckSquare },
    { title: "Notifications", url: "/warden/notifications", icon: Bell },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Hostel Management", url: "/admin/hostels", icon: Building2 },
    { title: "Reports & Analytics", url: "/admin/reports", icon: BarChart3 },
    { title: "Notifications", url: "/admin/notifications", icon: Bell },
  ];

  const items = role === "student" ? studentItems : role === "warden" ? wardenItems : adminItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SVNIT Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SVNIT</span>
            <span className="text-xs text-muted-foreground">Hostel Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "student" ? "Student Portal" : role === "warden" ? "Warden Portal" : "Admin Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a href={item.url} onClick={(e) => { e.preventDefault(); setLocation(item.url); }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="link-profile">
              <a href={`/${role}/profile`} onClick={(e) => { e.preventDefault(); setLocation(`/${role}/profile`); }}>
                <User />
                <span>Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="button-logout">
              <a href="/" onClick={(e) => { e.preventDefault(); setLocation('/'); }}>
                <LogOut />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
