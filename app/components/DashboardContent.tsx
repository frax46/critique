import React from 'react';

type DashboardContentProps = {
  children: React.ReactNode;
};

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {children}
    </div>
  );
}