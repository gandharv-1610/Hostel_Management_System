import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@shared/schema";
import { Loader2, Search, Users } from "lucide-react";

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: studentsData, isLoading } = useQuery<{ students: User[] }>({
    queryKey: ["/api/students"],
  });

  const students = studentsData?.students || [];

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.department?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const totalStudents = students.length;
  const avgGpa = students.length > 0
    ? students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length / 10
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalStudents}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{avgGpa.toFixed(2)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{filteredStudents.length}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>All registered students</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No students found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.department ? (
                        <Badge variant="outline">{student.department}</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{student.year || "N/A"}</TableCell>
                    <TableCell>
                      {student.gpa ? (student.gpa / 10).toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell>{student.phone || "N/A"}</TableCell>
                    <TableCell>
                      {student.gender ? (
                        <Badge variant="secondary" className="capitalize">
                          {student.gender}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
