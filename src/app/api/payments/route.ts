import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coupleId = searchParams.get('couple_id');
  if (!coupleId) {
    return NextResponse.json({ error: 'Couple ID is required' }, { status: 400 });
  }

  const couple = await db.couple.findUnique({
    where: { id: coupleId },
    select: {
      stripe_customer_id: true,
      stripe_subscription_id: true,
      subscription_status: true,
    },
  });

  return NextResponse.json(couple);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'customer.created': {
      const customer = event.data.object as Stripe.Customer;
      const coupleId = (customer.metadata && (customer.metadata.coupleId as string)) || null;
      if (coupleId) {
        await db.couple.update({
          where: { id: coupleId },
          data: { stripe_customer_id: customer.id },
        });
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const couple = await db.couple.findFirst({
        where: { stripe_customer_id: customerId },
      });
      if (couple) {
        await db.couple.update({
          where: { id: couple.id },
          data: {
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          },
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}