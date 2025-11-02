import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { Loader2, Edit2, Save, X } from "lucide-react";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    values: {
      name: userData?.user?.name || "",
      phone: userData?.user?.phone || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!userData?.user?.id) throw new Error("User ID not found");
      const res = await apiRequest("PATCH", `/api/students/${userData.user.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  const onSubmit = (data: ProfileUpdateData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const user = userData?.user;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  disabled={updateMutation.isPending}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  disabled={updateMutation.isPending}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  disabled={updateMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Department</Label>
                <p className="text-lg font-medium">{user?.department || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Year</Label>
                <p className="text-lg font-medium">{user?.year || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">GPA</Label>
                <p className="text-lg font-medium">{user?.gpa ? (user.gpa / 10).toFixed(2) : "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="text-lg font-medium">{user?.phone || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Gender</Label>
                <p className="text-lg font-medium capitalize">{user?.gender || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Role</Label>
                <p className="text-lg font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
