import { db } from './db';
import { userSubscriptions } from './schema';
import { eq } from 'drizzle-orm';

export async function checkSubscription(userId: string) {
  if (!userId) {
    return false;
  }

  const subscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);

  if (subscriptions?.length === 0) {
    return false;
  }

  const subscription = subscriptions[0];

  if (
    subscription &&
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd &&
    subscription.stripeCurrentPeriodEnd.getTime() + 24 * 60 * 60 * 1000 >
      Date.now()
  ) {
    return true;
  }

  return false;
}
