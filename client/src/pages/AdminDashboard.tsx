import { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Bed, Users, Wrench, Plus, Settings } from "lucide-react";

export default function AdminDashboard() {
  const [recentActivity] = useState([
    { id: 1, action: "Room 301 marked for maintenance", time: "5 mins ago", user: "Admin" },
    { id: 2, action: "Allotment window opened for Year 3", time: "2 hours ago", user: "Admin" },
    { id: 3, action: "New hostel wing added: Hostel D - East Wing", time: "1 day ago", user: "Admin" },
  ]);

  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-admin-dashboard">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage hostels, rooms, and allotments</p>
          </div>
          <Button data-testid="button-open-allotment">
            <Settings className="w-4 h-4 mr-2" />
            Allotment Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Rooms"
            value={450}
            description="Across all hostels"
            icon={Bed}
          />
          <DashboardCard
            title="Occupied"
            value={387}
            description="86% occupancy"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardCard
            title="Available"
            value={48}
            description="Ready for allotment"
            icon={Building2}
          />
          <DashboardCard
            title="Maintenance"
            value={15}
            description="Under repair"
            icon={Wrench}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-hostel">
                <Plus className="w-4 h-4 mr-2" />
                Add New Hostel
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-wing">
                <Plus className="w-4 h-4 mr-2" />
                Add Wing
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-floor">
                <Plus className="w-4 h-4 mr-2" />
                Add Floor
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-room">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" data-testid={`text-activity-${activity.id}`}>{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{activity.user}</Badge>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Allotment Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Year 2 (Batch 2024)</h3>
                <Badge variant="default" className="mb-3">Open</Badge>
                <p className="text-sm text-muted-foreground mb-3">GPA Priority: 8.0+</p>
                <Button size="sm" variant="outline" className="w-full" data-testid="button-close-year2">
                  Close Window
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Year 3 (Batch 2023)</h3>
                <Badge variant="secondary" className="mb-3">Closed</Badge>
                <p className="text-sm text-muted-foreground mb-3">Completed</p>
                <Button size="sm" variant="outline" className="w-full" data-testid="button-open-year3">
                  Open Window
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Year 4 (Batch 2022)</h3>
                <Badge variant="secondary" className="mb-3">Closed</Badge>
                <p className="text-sm text-muted-foreground mb-3">Not started</p>
                <Button size="sm" variant="outline" className="w-full" data-testid="button-open-year4">
                  Open Window
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
