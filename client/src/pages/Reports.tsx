import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hostel, RoomSwapRequest, LeaveApplication, MessChangeRequest, User } from "@shared/schema";
import { Loader2, TrendingUp, Users, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const { data: hostelsData, isLoading: hostelsLoading } = useQuery<{ hostels: Hostel[] }>({
    queryKey: ["/api/hostels"],
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery<{ students: User[] }>({
    queryKey: ["/api/students"],
  });

  const { data: roomSwapsData } = useQuery<{ requests: RoomSwapRequest[] }>({
    queryKey: ["/api/room-swaps"],
  });

  const { data: leaveAppsData } = useQuery<{ applications: LeaveApplication[] }>({
    queryKey: ["/api/leave-applications"],
  });

  const { data: messChangesData } = useQuery<{ requests: MessChangeRequest[] }>({
    queryKey: ["/api/mess-changes"],
  });

  const { data: roomsData } = useQuery<{ rooms: any[] }>({
    queryKey: ["/api/rooms"],
  });

  if (hostelsLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const hostels = hostelsData?.hostels || [];
  const students = studentsData?.students || [];
  const roomSwaps = roomSwapsData?.requests || [];
  const leaveApps = leaveAppsData?.applications || [];
  const messChanges = messChangesData?.requests || [];
  const rooms = roomsData?.rooms || [];

  const totalStudents = students.length;
  const totalHostels = hostels.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r: any) => r.occupiedCount > 0).length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const pendingRoomSwaps = roomSwaps.filter(r => r.status === "pending").length;
  const pendingLeaveApps = leaveApps.filter(a => a.status === "pending").length;
  const pendingMessChanges = messChanges.filter(r => r.status === "pending").length;

  const hostelOccupancyData = hostels.map(h => ({
    name: h.name,
    occupied: h.occupiedCapacity,
    available: h.totalCapacity - h.occupiedCapacity,
    occupancy: h.totalCapacity > 0 ? Math.round((h.occupiedCapacity / h.totalCapacity) * 100) : 0,
  }));

  const requestStatusData = [
    { name: 'Room Swaps', pending: pendingRoomSwaps, approved: roomSwaps.filter(r => r.status === "approved").length, rejected: roomSwaps.filter(r => r.status === "rejected").length },
    { name: 'Leave Apps', pending: pendingLeaveApps, approved: leaveApps.filter(a => a.status === "approved").length, rejected: leaveApps.filter(a => a.status === "rejected").length },
    { name: 'Mess Changes', pending: pendingMessChanges, approved: messChanges.filter(r => r.status === "approved").length, rejected: messChanges.filter(r => r.status === "rejected").length },
  ];

  const genderDistribution = [
    { name: 'Male', value: students.filter(s => s.gender === 'male').length },
    { name: 'Female', value: students.filter(s => s.gender === 'female').length },
    { name: 'Other', value: students.filter(s => s.gender === 'other').length },
  ].filter(item => item.value > 0);

  const yearDistribution = [
    { name: 'Year 1', value: students.filter(s => s.year === 1).length },
    { name: 'Year 2', value: students.filter(s => s.year === 2).length },
    { name: 'Year 3', value: students.filter(s => s.year === 3).length },
    { name: 'Year 4', value: students.filter(s => s.year === 4).length },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Overview of hostel management statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{totalStudents}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{totalHostels}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">{occupancyRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {occupiedRooms} / {totalRooms} rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold">
                {pendingRoomSwaps + pendingLeaveApps + pendingMessChanges}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hostel Occupancy</CardTitle>
            <CardDescription>Current occupancy status by hostel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hostelOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3b82f6" name="Occupied" />
                <Bar dataKey="available" fill="#10b981" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Overview</CardTitle>
            <CardDescription>Status of all requests by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Gender Distribution</CardTitle>
            <CardDescription>Distribution of students by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Year Distribution</CardTitle>
            <CardDescription>Distribution of students by year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={yearDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {yearDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests Summary</CardTitle>
          <CardDescription>All requests awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Room Swap Requests</span>
                <Badge variant={pendingRoomSwaps > 0 ? "destructive" : "secondary"}>
                  {pendingRoomSwaps}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Approved: {roomSwaps.filter(r => r.status === "approved").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Rejected: {roomSwaps.filter(r => r.status === "rejected").length}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Leave Applications</span>
                <Badge variant={pendingLeaveApps > 0 ? "destructive" : "secondary"}>
                  {pendingLeaveApps}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Approved: {leaveApps.filter(a => a.status === "approved").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Rejected: {leaveApps.filter(a => a.status === "rejected").length}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mess Change Requests</span>
                <Badge variant={pendingMessChanges > 0 ? "destructive" : "secondary"}>
                  {pendingMessChanges}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Approved: {messChanges.filter(r => r.status === "approved").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Rejected: {messChanges.filter(r => r.status === "rejected").length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
