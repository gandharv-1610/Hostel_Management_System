import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Navigation, Layers } from "lucide-react";

interface HostelFilterProps {
  onFilterChange?: (filters: {
    hostel: string;
    wing: string;
    floor: string;
  }) => void;
}

export default function HostelFilter({ onFilterChange }: HostelFilterProps) {
  const [hostel, setHostel] = useState("");
  const [wing, setWing] = useState("");
  const [floor, setFloor] = useState("");

  const handleHostelChange = (value: string) => {
    setHostel(value);
    setWing("");
    setFloor("");
    onFilterChange?.({ hostel: value, wing: "", floor: "" });
  };

  const handleWingChange = (value: string) => {
    setWing(value);
    setFloor("");
    onFilterChange?.({ hostel, wing: value, floor: "" });
  };

  const handleFloorChange = (value: string) => {
    setFloor(value);
    onFilterChange?.({ hostel, wing, floor: value });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hostel" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Hostel
            </Label>
            <Select value={hostel} onValueChange={handleHostelChange}>
              <SelectTrigger id="hostel" data-testid="select-hostel" className="h-12">
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hostel-a">Hostel A (Boys)</SelectItem>
                <SelectItem value="hostel-b">Hostel B (Boys)</SelectItem>
                <SelectItem value="hostel-c">Hostel C (Girls)</SelectItem>
                <SelectItem value="hostel-d">Hostel D (Girls)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wing" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Wing
            </Label>
            <Select value={wing} onValueChange={handleWingChange} disabled={!hostel}>
              <SelectTrigger id="wing" data-testid="select-wing" className="h-12">
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North Wing</SelectItem>
                <SelectItem value="south">South Wing</SelectItem>
                <SelectItem value="east">East Wing</SelectItem>
                <SelectItem value="west">West Wing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Floor
            </Label>
            <Select value={floor} onValueChange={handleFloorChange} disabled={!wing}>
              <SelectTrigger id="floor" data-testid="select-floor" className="h-12">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ground Floor</SelectItem>
                <SelectItem value="2">1st Floor</SelectItem>
                <SelectItem value="3">2nd Floor</SelectItem>
                <SelectItem value="4">3rd Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
