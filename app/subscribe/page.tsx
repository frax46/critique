import { getUserSubscriptions, getExpiredSubscriptions } from "../actions/userActions";
import DeleteSubscriptionButton from "./DeleteSubscriptionButton";
import NoSubscribed from "./noSubscribed";


const SubscribePage = async () => {
  const activeSubscriptions = await getUserSubscriptions();
  const expiredSubscriptions = await getExpiredSubscriptions();
  const hasActiveSubscription = activeSubscriptions && activeSubscriptions.length > 0;

  if (!hasActiveSubscription) {
    return <NoSubscribed />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          You&apos;re Already Subscribed
        </h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Active Subscription
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-gray-600 dark:text-gray-400">
              Your subscription is active until{" "}
              <span className="font-semibold">
                {activeSubscriptions[0].expiresAt.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {expiredSubscriptions && expiredSubscriptions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Expired Subscriptions
            </h2>
            <div className="space-y-4">
              {expiredSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Expired on{" "}
                      <span className="font-semibold">
                        {subscription.expiresAt.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <DeleteSubscriptionButton subscriptionId={subscription.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;
