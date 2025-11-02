import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  roomNumber: string;
  capacity: number;
  type: string;
  status: "available" | "occupied" | "maintenance";
  isSelected?: boolean;
  onClick?: () => void;
}

export default function RoomCard({ roomNumber, capacity, type, status, isSelected, onClick }: RoomCardProps) {
  const isDisabled = status === "maintenance";
  
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover-elevate",
        isSelected && "border-primary bg-primary/5",
        isDisabled && "opacity-50 cursor-not-allowed bg-destructive/5"
      )}
      onClick={isDisabled ? undefined : onClick}
      data-testid={`card-room-${roomNumber}`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-lg font-semibold" data-testid={`text-room-${roomNumber}`}>
                {roomNumber}
              </div>
              <div className="text-sm text-muted-foreground">{type}</div>
            </div>
            <Badge
              variant={status === "available" ? "default" : status === "occupied" ? "secondary" : "destructive"}
              data-testid={`badge-status-${roomNumber}`}
            >
              {status === "maintenance" ? "Under Maintenance" : status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{capacity} beds</span>
            </div>
            {status === "occupied" && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{capacity}/{capacity}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
