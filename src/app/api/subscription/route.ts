import { db } from '@/lib/db';
import { userSubscriptions } from '@/lib/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          isPlusUser: false,
        },
        { status: 401 },
      );
    }

    const subscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.userId))
      .limit(1);

    if (subscriptions?.length === 0) {
      return NextResponse.json(
        {
          isPlusUser: false,
        },
        { status: 200 },
      );
    }

    const subscription = subscriptions[0];

    if (
      subscription &&
      subscription.stripePriceId &&
      subscription.stripeCurrentPeriodEnd &&
      subscription.stripeCurrentPeriodEnd.getTime() + 24 * 60 * 60 * 1000 >
        Date.now()
    ) {
      return NextResponse.json(
        {
          isPlusUser: true,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        isPlusUser: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(`Error - GET /subscription: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
