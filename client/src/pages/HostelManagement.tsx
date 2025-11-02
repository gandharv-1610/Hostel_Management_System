import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Hostel, Room } from "@shared/schema";
import { Loader2, Plus, Building, Bed, Wrench } from "lucide-react";

const hostelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "other"]),
  totalCapacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

const roomSchema = z.object({
  floorId: z.string().min(1, "Floor is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

type HostelFormData = z.infer<typeof hostelSchema>;
type RoomFormData = z.infer<typeof roomSchema>;

export default function HostelManagement() {
  const [hostelDialogOpen, setHostelDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hostelsData, isLoading: hostelsLoading } = useQuery<{ hostels: Hostel[] }>({
    queryKey: ["/api/hostels"],
  });

  const { data: roomsData, isLoading: roomsLoading } = useQuery<{ rooms: any[] }>({
    queryKey: ["/api/rooms"],
  });

  const hostelForm = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      name: "",
      gender: "male",
      totalCapacity: 100,
    },
  });

  const roomForm = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      floorId: "",
      roomNumber: "",
      capacity: 2,
    },
  });

  const createHostelMutation = useMutation({
    mutationFn: async (data: HostelFormData) => {
      const res = await apiRequest("POST", "/api/hostels", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hostels"] });
      setHostelDialogOpen(false);
      hostelForm.reset();
      toast({
        title: "Hostel created",
        description: "New hostel has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: async (data: RoomFormData) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      setRoomDialogOpen(false);
      roomForm.reset();
      toast({
        title: "Room created",
        description: "New room has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleMaintenanceMutation = useMutation({
    mutationFn: async ({ roomId, isUnderMaintenance }: { roomId: string; isUnderMaintenance: boolean }) => {
      const res = await apiRequest("PATCH", `/api/rooms/${roomId}`, { isUnderMaintenance });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Room updated",
        description: "Room maintenance status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const hostels = hostelsData?.hostels || [];
  const rooms = roomsData?.rooms || [];

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r: any) => r.occupiedCount > 0).length;
  const maintenanceRooms = rooms.filter((r: any) => r.isUnderMaintenance).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hostel Management</h1>
        <p className="text-muted-foreground mt-1">Manage hostels, wings, floors, and rooms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{hostels.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalRooms}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{occupiedRooms}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{maintenanceRooms}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hostels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hostels">Hostels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="hostels">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hostels</CardTitle>
                  <CardDescription>Manage hostel buildings</CardDescription>
                </div>
                <Dialog open={hostelDialogOpen} onOpenChange={setHostelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Hostel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Hostel</DialogTitle>
                      <DialogDescription>Add a new hostel building to the system</DialogDescription>
                    </DialogHeader>
                    <Form {...hostelForm}>
                      <form onSubmit={hostelForm.handleSubmit((data) => createHostelMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={hostelForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hostel Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Hostel A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={hostelForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={hostelForm.control}
                          name="totalCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Capacity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="submit" disabled={createHostelMutation.isPending}>
                            {createHostelMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Hostel
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {hostelsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : hostels.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No hostels found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Occupancy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostels.map((hostel) => (
                      <TableRow key={hostel.id}>
                        <TableCell className="font-medium">{hostel.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{hostel.gender}</Badge>
                        </TableCell>
                        <TableCell>{hostel.totalCapacity}</TableCell>
                        <TableCell>{hostel.occupiedCapacity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(hostel.occupiedCapacity / hostel.totalCapacity) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((hostel.occupiedCapacity / hostel.totalCapacity) * 100)}%
                            </span>
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

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>Manage individual rooms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {roomsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : rooms.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No rooms found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Maintenance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room: any) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.roomNumber}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>{room.occupiedCount}</TableCell>
                        <TableCell>
                          {room.isUnderMaintenance ? (
                            <Badge variant="destructive">Under Maintenance</Badge>
                          ) : room.occupiedCount >= room.capacity ? (
                            <Badge variant="secondary">Full</Badge>
                          ) : (
                            <Badge variant="default">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={room.isUnderMaintenance}
                            onCheckedChange={(checked) => 
                              toggleMaintenanceMutation.mutate({ 
                                roomId: room.id, 
                                isUnderMaintenance: checked 
                              })
                            }
                            disabled={toggleMaintenanceMutation.isPending}
                          />
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
