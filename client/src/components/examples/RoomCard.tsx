import { useState } from 'react';
import RoomCard from '../RoomCard';

export default function RoomCardExample() {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <RoomCard
        roomNumber="101"
        capacity={2}
        type="Double"
        status="available"
        isSelected={selected === "101"}
        onClick={() => setSelected("101")}
      />
      <RoomCard
        roomNumber="102"
        capacity={3}
        type="Triple"
        status="occupied"
      />
      <RoomCard
        roomNumber="103"
        capacity={2}
        type="Double"
        status="maintenance"
      />
    </div>
  );
}
