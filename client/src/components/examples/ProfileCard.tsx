import ProfileCard from '../ProfileCard';

export default function ProfileCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <ProfileCard
        name="Rahul Sharma"
        rollNumber="U24CS100"
        year={2}
        branch="Computer Science"
        gpa={8.5}
      />
    </div>
  );
}
