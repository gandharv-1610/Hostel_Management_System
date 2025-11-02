import DashboardCard from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Bed, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WardenDashboard() {
  const students = [
    { id: 1, name: "Rahul Sharma", rollNo: "U24CS100", room: "201", wing: "North" },
    { id: 2, name: "Priya Patel", rollNo: "U24EC045", room: "202", wing: "North" },
    { id: 3, name: "Amit Kumar", rollNo: "U24ME078", room: "203", wing: "North" },
    { id: 4, name: "Sneha Verma", rollNo: "U24CE032", room: "204", wing: "North" },
  ];

  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-warden-dashboard">Warden Dashboard</h1>
          <p className="text-muted-foreground mt-1">Hostel A - Boys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Total Capacity"
            value={120}
            description="Beds available"
            icon={Bed}
          />
          <DashboardCard
            title="Occupied"
            value={105}
            description="87.5% occupancy"
            icon={Users}
          />
          <DashboardCard
            title="Maintenance"
            value={5}
            description="Rooms under repair"
            icon={Settings}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg hover-elevate">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">Room Swap Request</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rahul Sharma (201) ↔ Amit Kumar (203)
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default" data-testid="button-approve-swap">Approve</Button>
                    <Button size="sm" variant="outline" data-testid="button-reject-swap">Reject</Button>
                  </div>
                </div>

                <div className="p-3 border rounded-lg hover-elevate">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">Leave Application</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Priya Patel - Dec 20-25, 2024
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default" data-testid="button-approve-leave">Approve</Button>
                    <Button size="sm" variant="outline" data-testid="button-reject-leave">Reject</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Student List</span>
                <Badge variant="secondary">{students.length} students</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="p-3 border rounded-lg hover-elevate" data-testid={`student-${student.id}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{student.rollNo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Room {student.room}</p>
                        <p className="text-xs text-muted-foreground">{student.wing} Wing</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
