export function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">Recent Activity</h2>
        <p className="text-blue-600 dark:text-blue-300">You have 3 new notifications</p>
      </div>
      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">Analytics</h2>
        <p className="text-green-600 dark:text-green-300">Your profile views are up by 12%</p>
      </div>
    </div>
  );
}