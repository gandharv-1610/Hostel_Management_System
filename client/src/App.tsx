import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import WardenDashboard from "@/pages/WardenDashboard";
import RoomAllotment from "@/pages/RoomAllotment";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import RoomSwapRequest from "@/pages/RoomSwapRequest";
import LeaveApplication from "@/pages/LeaveApplication";
import MessChangeRequest from "@/pages/MessChangeRequest";
import ApprovalsManagement from "@/pages/ApprovalsManagement";
import StudentManagement from "@/pages/StudentManagement";
import HostelManagement from "@/pages/HostelManagement";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

function DashboardLayout({ role }: { role: "student" | "warden" | "admin" }) {
  const [location] = useLocation();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  let content;
  if (role === "student") {
    if (location === "/student/allotment") {
      content = <RoomAllotment />;
    } else if (location === "/student/room-swap") {
      content = <RoomSwapRequest />;
    } else if (location === "/student/leave") {
      content = <LeaveApplication />;
    } else if (location === "/student/mess-change") {
      content = <MessChangeRequest />;
    } else if (location === "/student/notifications") {
      content = <Notifications />;
    } else if (location === "/student/profile") {
      content = <Profile />;
    } else {
      content = <StudentDashboard />;
    }
  } else if (role === "warden") {
    if (location === "/warden/students") {
      content = <StudentManagement />;
    } else if (location === "/warden/approvals") {
      content = <ApprovalsManagement />;
    } else if (location === "/warden/notifications") {
      content = <Notifications />;
    } else if (location === "/warden/profile") {
      content = <Profile />;
    } else {
      content = <WardenDashboard />;
    }
  } else if (role === "admin") {
    if (location === "/admin/hostels") {
      content = <HostelManagement />;
    } else if (location === "/admin/reports") {
      content = <Reports />;
    } else if (location === "/admin/notifications") {
      content = <Notifications />;
    } else if (location === "/admin/profile") {
      content = <Profile />;
    } else {
      content = <AdminDashboard />;
    }
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role={role} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {content}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/" component={Login} />
          
          <Route path="/student"><DashboardLayout role="student" /></Route>
          <Route path="/student/allotment"><DashboardLayout role="student" /></Route>
          <Route path="/student/room-swap"><DashboardLayout role="student" /></Route>
          <Route path="/student/leave"><DashboardLayout role="student" /></Route>
          <Route path="/student/mess-change"><DashboardLayout role="student" /></Route>
          <Route path="/student/notifications"><DashboardLayout role="student" /></Route>
          <Route path="/student/profile"><DashboardLayout role="student" /></Route>
          
          <Route path="/warden"><DashboardLayout role="warden" /></Route>
          <Route path="/warden/students"><DashboardLayout role="warden" /></Route>
          <Route path="/warden/approvals"><DashboardLayout role="warden" /></Route>
          <Route path="/warden/notifications"><DashboardLayout role="warden" /></Route>
          <Route path="/warden/profile"><DashboardLayout role="warden" /></Route>
          
          <Route path="/admin"><DashboardLayout role="admin" /></Route>
          <Route path="/admin/hostels"><DashboardLayout role="admin" /></Route>
          <Route path="/admin/reports"><DashboardLayout role="admin" /></Route>
          <Route path="/admin/notifications"><DashboardLayout role="admin" /></Route>
          <Route path="/admin/profile"><DashboardLayout role="admin" /></Route>
          
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
