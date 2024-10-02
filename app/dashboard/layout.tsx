import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardNav } from "../components/DashboardNav";
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardContent } from '../components/DashboardContent';


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/');
  }

  const user = await currentUser();
  
  if (!user || user.emailAddresses[0].emailAddress !== 'annobilfrance@gmail.com') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader user={user} />
        <DashboardNav />
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
}