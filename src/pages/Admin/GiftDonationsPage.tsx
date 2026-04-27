import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { getAllGiftBonds, getActiveGiftBondPrice, type GiftBond } from '@/api/GiftBond';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Gift, Clock, CheckCircle, Loader2 } from 'lucide-react';

const GiftDonationsPage: React.FC = () => {
  const [giftDonations, setGiftDonations] = useState<GiftBond[]>([]);
  const [activePrice, setActivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGiftDonations = async () => {
      try {
        setLoading(true);
        const [gifts, price] = await Promise.all([getAllGiftBonds(), getActiveGiftBondPrice()]);
        setGiftDonations(gifts);
        setActivePrice(price?.price ?? null);
      } catch (error) {
        toast({
          title: 'Failed to load gift donations',
          description: 'There was a problem retrieving the gift bonds data.',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftDonations();
  }, [toast]);

  const pendingCount = giftDonations.filter((item) => item.status === 'pending').length;
  const paidCount = giftDonations.filter((item) => item.status === 'paid').length;
  const totalBonds = giftDonations.reduce((sum, item) => sum + item.numberOfBonds, 0);
  const totalAmount = giftDonations.reduce((sum, item) => sum + item.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <Badge className="bg-emerald-100 text-emerald-700">Paid</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
    return <Badge className="bg-slate-100 text-slate-700">Unknown</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout title="Gift Donations">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gift Donations">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Gift Donations</h1>
              <p className="mt-2 text-sm text-slate-600">Monitor gift bond donations and confirm the active gift price.</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
              Active gift price: {activePrice !== null ? `${activePrice.toFixed(2)} USD` : 'Not available'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Pending</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{pendingCount}</p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">Paid</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{paidCount}</p>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-700 font-semibold">Gift Bonds</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{totalBonds}</p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700 font-semibold">Total Amount</p>
            <p className="mt-3 text-3xl font-black text-slate-900">${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Gift donation details</h2>
              <p className="text-sm text-slate-500">This page uses your gift bond DB fields and normalizes them safely before rendering.</p>
            </div>
          </div>

          {giftDonations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-slate-600">No gift donations available right now.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Bonds</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giftDonations.map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-slate-50 transition">
                    <TableCell className="font-semibold">#{donation.id}</TableCell>
                    <TableCell>{donation.recipientName || 'N/A'}</TableCell>
                    <TableCell>{donation.recipientPhone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{donation.recipientAddress || 'N/A'}</TableCell>
                    <TableCell>{donation.numberOfBonds}</TableCell>
                    <TableCell>${donation.bondPrice.toFixed(2)}</TableCell>
                    <TableCell>${donation.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell>{new Date(donation.createdAt).toLocaleDateString('en-US')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GiftDonationsPage;
