import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  name: string;
  rollNumber: string;
  year: number;
  branch: string;
  gpa?: number;
}

export default function ProfileCard({ name, rollNumber, year, branch, gpa }: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg" data-testid="text-student-name">{name}</h3>
            <p className="text-sm text-muted-foreground font-mono" data-testid="text-roll-number">{rollNumber}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Year</p>
            <p className="font-semibold" data-testid="text-year">{year}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Branch</p>
            <p className="font-semibold" data-testid="text-branch">{branch}</p>
          </div>
          {gpa && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">GPA</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-semibold" data-testid="text-gpa">{gpa.toFixed(2)}</p>
                <Badge variant={gpa >= 8 ? "default" : "secondary"} className="text-xs">
                  {gpa >= 8 ? "High Priority" : "Standard"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
