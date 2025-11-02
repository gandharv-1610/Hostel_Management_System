import HostelInfoCard from '../HostelInfoCard';

export default function HostelInfoCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <HostelInfoCard
        hostelName="Hostel A (Boys)"
        wing="North"
        floor={2}
        roomNumber="201"
        messName="Central Mess"
      />
    </div>
  );
}
