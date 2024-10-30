import { getUserSubscriptions } from "../actions/userActions";
import NoSubscribed from "./noSubscribed";

const SubscribePage = async () => {
  const subscriptions = await getUserSubscriptions();
  const hasActiveSubscription = subscriptions && subscriptions.length > 0;

  if (!hasActiveSubscription) {
    return <NoSubscribed />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          You're Already Subscribed
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Your subscription is active until{" "}
          {subscriptions[0].expiresAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default SubscribePage;
