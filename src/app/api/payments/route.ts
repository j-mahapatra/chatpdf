import { db } from '@/lib/db';
import { userSubscriptions } from '@/lib/schema';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const returnUrl = `${process.env.NEXT_BASE_URL}/`;
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, user.id));

    if (subscriptions?.length > 0 && subscriptions[0].stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptions[0].stripeCustomerId,
        return_url: returnUrl,
      });
      return NextResponse.json({ url: stripeSession.url }, { status: 200 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.primaryEmailAddress?.emailAddress || '',
      shipping_address_collection: { allowed_countries: ['IN'] },
      line_items: [
        {
          price_data: {
            currency: 'INR',
            product_data: {
              name: 'ChatPDF Plus',
              description: 'Unlimited access to all features',
            },
            unit_amount: 50000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error) {
    console.log(`Error - GET /payments: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
