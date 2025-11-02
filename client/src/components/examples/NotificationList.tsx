import NotificationList from '../NotificationList';

export default function NotificationListExample() {
  const notifications = [
    {
      id: "1",
      title: "Room Allotment Confirmed",
      message: "Your room has been successfully allocated to Hostel A, Wing North, Floor 2, Room 201",
      type: "success" as const,
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "Mess Assignment",
      message: "You have been assigned to Central Mess for this month",
      type: "info" as const,
      timestamp: "1 day ago",
      read: false
    },
    {
      id: "3",
      title: "Maintenance Notice",
      message: "Room maintenance scheduled for next week. Please coordinate with warden.",
      type: "warning" as const,
      timestamp: "2 days ago",
      read: true
    }
  ];

  return (
    <div className="p-6 max-w-md">
      <NotificationList notifications={notifications} />
    </div>
  );
}
