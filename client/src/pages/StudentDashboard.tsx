import { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import ProfileCard from "@/components/ProfileCard";
import HostelInfoCard from "@/components/HostelInfoCard";
import NotificationList from "@/components/NotificationList";
import { Button } from "@/components/ui/button";
import { Home, Bed, Utensils, FileText } from "lucide-react";

export default function StudentDashboard() {
  const [notifications] = useState([
    {
      id: "1",
      title: "Room Allotment Confirmed",
      message: "Your room has been successfully allocated to Hostel A, Wing North, Floor 2, Room 201",
      type: "success" as const,
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "Mess Assignment",
      message: "You have been assigned to Central Mess for this month",
      type: "info" as const,
      timestamp: "1 day ago",
      read: false
    },
    {
      id: "3",
      title: "Allotment Window Open",
      message: "Room allotment for next semester is now open",
      type: "info" as const,
      timestamp: "3 days ago",
      read: true
    }
  ]);

  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your hostel information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileCard
                name="Rahul Sharma"
                rollNumber="U24CS100"
                year={2}
                branch="Computer Science"
                gpa={8.5}
              />
              <HostelInfoCard
                hostelName="Hostel A (Boys)"
                wing="North"
                floor={2}
                roomNumber="201"
                messName="Central Mess"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DashboardCard
                title="Room Status"
                value="Allocated"
                description="Hostel A - Room 201"
                icon={Bed}
              />
              <DashboardCard
                title="Mess Assignment"
                value="Central Mess"
                description="Active this month"
                icon={Utensils}
              />
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start h-auto py-3" data-testid="button-view-room">
                  <Bed className="w-4 h-4 mr-2" />
                  View Room Details
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" data-testid="button-change-mess">
                  <Utensils className="w-4 h-4 mr-2" />
                  Request Mess Change
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" data-testid="button-apply-leave">
                  <FileText className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <NotificationList notifications={notifications} />
          </div>
        </div>
      </div>
    </div>
  );
}
