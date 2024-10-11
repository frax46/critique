import { User } from '@clerk/nextjs/server';

type DashboardHeaderProps = {
  user: User;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-gray-800 ">Dashboard</h1>
      <p className="text-gray-600  mt-2">Welcome to your dashboard, {user.firstName}!</p>
    </div>
  );
}