import { PremiumModal } from '@/components/PremiumModal';

export default function BillingPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="text-sm text-gray-600">
        Manage your subscription and payment details.
      </p>
      <PremiumModal />
    </div>
  );
}
