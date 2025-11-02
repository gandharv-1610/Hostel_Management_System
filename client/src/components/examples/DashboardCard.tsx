import DashboardCard from '../DashboardCard';
import { Users } from 'lucide-react';

export default function DashboardCardExample() {
  return (
    <div className="p-6 space-y-4">
      <DashboardCard
        title="Total Students"
        value={1234}
        description="Across all hostels"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
