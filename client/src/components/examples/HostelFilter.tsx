import HostelFilter from '../HostelFilter';

export default function HostelFilterExample() {
  return (
    <div className="p-6">
      <HostelFilter
        onFilterChange={(filters) => console.log('Filters:', filters)}
      />
    </div>
  );
}
