import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RoomSwapRequest, User } from "@shared/schema";
import { Loader2, Send, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const roomSwapSchema = z.object({
  targetStudentId: z.string().min(1, "Target student ID is required"),
  reason: z.string().optional(),
});

type RoomSwapFormData = z.infer<typeof roomSwapSchema>;

export default function RoomSwapRequestPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  const { data: requestsData, isLoading } = useQuery<{ requests: RoomSwapRequest[] }>({
    queryKey: ["/api/room-swaps"],
  });

  const form = useForm<RoomSwapFormData>({
    resolver: zodResolver(roomSwapSchema),
    defaultValues: {
      targetStudentId: "",
      reason: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RoomSwapFormData) => {
      const res = await apiRequest("POST", "/api/room-swaps", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/room-swaps"] });
      form.reset();
      toast({
        title: "Request submitted",
        description: "Your room swap request has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RoomSwapFormData) => {
    createMutation.mutate(data);
  };

  const pendingRequests = requestsData?.requests?.filter(r => r.status === "pending") || [];
  const processedRequests = requestsData?.requests?.filter(r => r.status !== "pending") || [];

  const getStatusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="outline">Pending</Badge>;
    if (status === "approved") return <Badge variant="default">Approved</Badge>;
    return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Swap Request</h1>
        <p className="text-muted-foreground mt-1">Request to swap rooms with another student</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Request</CardTitle>
          <CardDescription>Enter the student ID of the person you want to swap rooms with</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="targetStudentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Student ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter student ID"
                        {...field}
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why you want to swap rooms..."
                        {...field}
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Your room swap requests awaiting approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">Request to: {request.targetStudentId}</span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    {request.reason && (
                      <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {processedRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>Previously processed requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {processedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">Request to: {request.targetStudentId}</span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    {request.reason && (
                      <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
