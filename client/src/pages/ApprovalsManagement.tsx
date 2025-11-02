import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RoomSwapRequest, LeaveApplication, MessChangeRequest } from "@shared/schema";
import { Loader2, Check, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function ApprovalsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roomSwapsData, isLoading: roomSwapsLoading } = useQuery<{ requests: RoomSwapRequest[] }>({
    queryKey: ["/api/room-swaps"],
  });

  const { data: leaveAppsData, isLoading: leaveAppsLoading } = useQuery<{ applications: LeaveApplication[] }>({
    queryKey: ["/api/leave-applications"],
  });

  const { data: messChangesData, isLoading: messChangesLoading } = useQuery<{ requests: MessChangeRequest[] }>({
    queryKey: ["/api/mess-changes"],
  });

  const approveRoomSwapMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await apiRequest("POST", `/api/room-swaps/${id}/approve`, { approved });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/room-swaps"] });
      toast({
        title: "Request processed",
        description: "Room swap request has been processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveLeaveAppMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await apiRequest("POST", `/api/leave-applications/${id}/approve`, { approved });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-applications"] });
      toast({
        title: "Application processed",
        description: "Leave application has been processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveMessChangeMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await apiRequest("POST", `/api/mess-changes/${id}/approve`, { approved });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mess-changes"] });
      toast({
        title: "Request processed",
        description: "Mess change request has been processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const roomSwaps = roomSwapsData?.requests?.filter(r => r.status === "pending") || [];
  const leaveApps = leaveAppsData?.applications?.filter(a => a.status === "pending") || [];
  const messChanges = messChangesData?.requests?.filter(r => r.status === "pending") || [];

  const totalPending = roomSwaps.length + leaveApps.length + messChanges.length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve pending requests ({totalPending} pending)
        </p>
      </div>

      <Tabs defaultValue="room-swaps" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="room-swaps">
            Room Swaps
            {roomSwaps.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {roomSwaps.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="leave-apps">
            Leave Applications
            {leaveApps.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {leaveApps.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mess-changes">
            Mess Changes
            {messChanges.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {messChanges.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="room-swaps">
          <Card>
            <CardHeader>
              <CardTitle>Pending Room Swap Requests</CardTitle>
              <CardDescription>Review and approve room swap requests</CardDescription>
            </CardHeader>
            <CardContent>
              {roomSwapsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : roomSwaps.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No pending requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requester</TableHead>
                      <TableHead>Target Student</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roomSwaps.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requesterId}</TableCell>
                        <TableCell>{request.targetStudentId}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason || "N/A"}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveRoomSwapMutation.mutate({ id: request.id, approved: true })}
                              disabled={approveRoomSwapMutation.isPending}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => approveRoomSwapMutation.mutate({ id: request.id, approved: false })}
                              disabled={approveRoomSwapMutation.isPending}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave-apps">
          <Card>
            <CardHeader>
              <CardTitle>Pending Leave Applications</CardTitle>
              <CardDescription>Review and approve leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              {leaveAppsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : leaveApps.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No pending applications</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.studentId}</TableCell>
                        <TableCell>
                          {format(new Date(app.startDate), "MMM d")} - {format(new Date(app.endDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{app.destination || "N/A"}</TableCell>
                        <TableCell className="max-w-xs truncate">{app.reason}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveLeaveAppMutation.mutate({ id: app.id, approved: true })}
                              disabled={approveLeaveAppMutation.isPending}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => approveLeaveAppMutation.mutate({ id: app.id, approved: false })}
                              disabled={approveLeaveAppMutation.isPending}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mess-changes">
          <Card>
            <CardHeader>
              <CardTitle>Pending Mess Change Requests</CardTitle>
              <CardDescription>Review and approve mess change requests</CardDescription>
            </CardHeader>
            <CardContent>
              {messChangesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : messChanges.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No pending requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Current Mess</TableHead>
                      <TableHead>New Mess</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messChanges.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.studentId}</TableCell>
                        <TableCell>{request.currentMessId}</TableCell>
                        <TableCell>{request.newMessId}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason || "N/A"}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveMessChangeMutation.mutate({ id: request.id, approved: true })}
                              disabled={approveMessChangeMutation.isPending}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => approveMessChangeMutation.mutate({ id: request.id, approved: false })}
                              disabled={approveMessChangeMutation.isPending}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
