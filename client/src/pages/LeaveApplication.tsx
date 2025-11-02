import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LeaveApplication } from "@shared/schema";
import { Loader2, Send, Calendar as CalendarIcon, FileText } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const leaveApplicationSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  destination: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type LeaveApplicationFormData = z.infer<typeof leaveApplicationSchema>;

export default function LeaveApplicationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applicationsData, isLoading } = useQuery<{ applications: LeaveApplication[] }>({
    queryKey: ["/api/leave-applications"],
  });

  const form = useForm<LeaveApplicationFormData>({
    resolver: zodResolver(leaveApplicationSchema),
    defaultValues: {
      reason: "",
      destination: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: LeaveApplicationFormData) => {
      const res = await apiRequest("POST", "/api/leave-applications", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leave-applications"] });
      form.reset();
      toast({
        title: "Application submitted",
        description: "Your leave application has been submitted successfully.",
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

  const onSubmit = (data: LeaveApplicationFormData) => {
    createMutation.mutate(data);
  };

  const applications = applicationsData?.applications || [];
  const pendingApplications = applications.filter(a => a.status === "pending");
  const approvedApplications = applications.filter(a => a.status === "approved");
  const rejectedApplications = applications.filter(a => a.status === "rejected");

  const getStatusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="outline">Pending</Badge>;
    if (status === "approved") return <Badge variant="default">Approved</Badge>;
    return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Application</h1>
        <p className="text-muted-foreground mt-1">Apply for leave from hostel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Application</CardTitle>
          <CardDescription>Fill in the details for your leave request</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where are you going?"
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
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain the reason for your leave..."
                        {...field}
                        disabled={createMutation.isPending}
                        rows={4}
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
                Submit Application
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
          {pendingApplications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Applications awaiting approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">
                          {format(new Date(app.startDate), "PPP")} - {format(new Date(app.endDate), "PPP")}
                        </span>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{app.reason}</p>
                    {app.destination && (
                      <p className="text-sm text-muted-foreground mb-2">Destination: {app.destination}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {approvedApplications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approved Applications</CardTitle>
                <CardDescription>Your approved leave requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {approvedApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">
                          {format(new Date(app.startDate), "PPP")} - {format(new Date(app.endDate), "PPP")}
                        </span>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{app.reason}</p>
                    {app.destination && (
                      <p className="text-sm text-muted-foreground mb-2">Destination: {app.destination}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {rejectedApplications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>Applications that were not approved</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rejectedApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">
                          {format(new Date(app.startDate), "PPP")} - {format(new Date(app.endDate), "PPP")}
                        </span>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{app.reason}</p>
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
