import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  console.log('request happened');
  const body = await req.json();

  if (body.type === 'user.created' || body.type === 'user.updated') {
    const user = body.data;

    const clerkId = user.id;
    const email = user.email_addresses?.[0]?.email_address || '';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId));

      if (existingUser.length === 0) {
        await db.insert(users).values({
          clerkId,
          email,
          firstName,
          lastName,
        });
      } else {
        await db
          .update(users)
          .set({ email, firstName, lastName })
          .where(eq(users.clerkId, clerkId));
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Error inserting user:', err);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unhandled event' }, { status: 400 });
}
