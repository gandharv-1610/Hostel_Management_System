import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessChangeRequest, Mess, User } from "@shared/schema";
import { Loader2, Send, Utensils } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const messChangeSchema = z.object({
  newMessId: z.string().min(1, "Please select a mess"),
  reason: z.string().optional(),
});

type MessChangeFormData = z.infer<typeof messChangeSchema>;

export default function MessChangeRequestPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  const { data: messesData, isLoading: messesLoading } = useQuery<{ messes: Mess[] }>({
    queryKey: ["/api/messes"],
  });

  const { data: requestsData, isLoading: requestsLoading } = useQuery<{ requests: MessChangeRequest[] }>({
    queryKey: ["/api/mess-changes"],
  });

  const form = useForm<MessChangeFormData>({
    resolver: zodResolver(messChangeSchema),
    defaultValues: {
      newMessId: "",
      reason: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MessChangeFormData) => {
      const res = await apiRequest("POST", "/api/mess-changes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mess-changes"] });
      form.reset();
      toast({
        title: "Request submitted",
        description: "Your mess change request has been submitted successfully.",
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

  const onSubmit = (data: MessChangeFormData) => {
    createMutation.mutate(data);
  };

  const messes = messesData?.messes || [];
  const requests = requestsData?.requests || [];
  const pendingRequests = requests.filter(r => r.status === "pending");
  const processedRequests = requests.filter(r => r.status !== "pending");

  const getStatusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="outline">Pending</Badge>;
    if (status === "approved") return <Badge variant="default">Approved</Badge>;
    return <Badge variant="destructive">Rejected</Badge>;
  };

  const currentMessId = requests.length > 0 
    ? requests.filter(r => r.status === "approved")[requests.filter(r => r.status === "approved").length - 1]?.newMessId || requests[0]?.currentMessId
    : undefined;
  
  const currentMess = messes.find(m => m.id === currentMessId);

  const availableMesses = messes.filter(m => m.id !== currentMessId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mess Change Request</h1>
        <p className="text-muted-foreground mt-1">Request to change your mess allotment</p>
      </div>

      {currentMess && (
        <Card>
          <CardHeader>
            <CardTitle>Current Mess</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Utensils className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xl font-semibold">{currentMess.name}</p>
                <p className="text-sm text-muted-foreground">
                  Capacity: {currentMess.currentCount}/{currentMess.capacity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Submit New Request</CardTitle>
          <CardDescription>Select a new mess and provide a reason for the change</CardDescription>
        </CardHeader>
        <CardContent>
          {messesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="newMessId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Mess</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a mess" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableMesses.map((mess) => (
                            <SelectItem key={mess.id} value={mess.id}>
                              {mess.name} ({mess.currentCount}/{mess.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          placeholder="Explain why you want to change mess..."
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
          )}
        </CardContent>
      </Card>

      {requestsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Mess change requests awaiting approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.map((request) => {
                  const newMess = messes.find(m => m.id === request.newMessId);
                  return (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4" />
                          <span className="font-medium">Change to: {newMess?.name}</span>
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
                  );
                })}
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
                {processedRequests.map((request) => {
                  const newMess = messes.find(m => m.id === request.newMessId);
                  return (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4" />
                          <span className="font-medium">Change to: {newMess?.name}</span>
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
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
