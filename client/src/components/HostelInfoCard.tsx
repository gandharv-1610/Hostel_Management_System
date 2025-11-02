import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HostelInfoCardProps {
  hostelName: string;
  wing: string;
  floor: number;
  roomNumber: string;
  messName?: string;
}

export default function HostelInfoCard({ hostelName, wing, floor, roomNumber, messName }: HostelInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold" data-testid="text-hostel-name">{hostelName}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span data-testid="text-location">Wing {wing}, Floor {floor}, Room {roomNumber}</span>
            </div>
          </div>
        </div>

        {messName && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Mess Assignment</p>
                <p className="font-semibold mt-1" data-testid="text-mess-name">{messName}</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
