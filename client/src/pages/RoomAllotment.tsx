import { useState } from "react";
import HostelFilter from "@/components/HostelFilter";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info } from "lucide-react";

export default function RoomAllotment() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [filters, setFilters] = useState({ hostel: "", wing: "", floor: "" });

  const rooms = [
    { id: "101", roomNumber: "101", capacity: 2, type: "Double", status: "available" as const },
    { id: "102", roomNumber: "102", capacity: 3, type: "Triple", status: "available" as const },
    { id: "103", roomNumber: "103", capacity: 2, type: "Double", status: "maintenance" as const },
    { id: "104", roomNumber: "104", capacity: 2, type: "Double", status: "occupied" as const },
    { id: "105", roomNumber: "105", capacity: 3, type: "Triple", status: "available" as const },
    { id: "106", roomNumber: "106", capacity: 2, type: "Double", status: "available" as const },
  ];

  const availableRooms = rooms.filter(r => r.status === "available");
  const showRooms = filters.hostel && filters.wing && filters.floor;

  const handleConfirm = () => {
    if (selectedRoom) {
      console.log("Confirming room:", selectedRoom);
      alert(`Room ${selectedRoom} has been successfully allocated!`);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-room-allotment">Room Allotment</h1>
          <p className="text-muted-foreground mt-1">Select your preferred room from available options</p>
        </div>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            You are eligible for room allotment. Priority is based on your GPA (8.5). Select your hostel, wing, and floor to view available rooms.
          </AlertDescription>
        </Alert>

        <HostelFilter onFilterChange={setFilters} />

        {showRooms && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Available Rooms</h2>
                <p className="text-sm text-muted-foreground">
                  {availableRooms.length} rooms available
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    roomNumber={room.roomNumber}
                    capacity={room.capacity}
                    type={room.type}
                    status={room.status}
                    isSelected={selectedRoom === room.roomNumber}
                    onClick={() => room.status === "available" && setSelectedRoom(room.roomNumber)}
                  />
                ))}
              </div>
            </div>

            {selectedRoom && (
              <div className="sticky bottom-0 bg-background border-t p-4 -mx-6 -mb-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Room {selectedRoom} Selected</p>
                      <p className="text-sm text-muted-foreground">Click confirm to proceed with allocation</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedRoom(null)} data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirm} data-testid="button-confirm">
                      Confirm Allotment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!showRooms && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select hostel, wing, and floor to view available rooms</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
