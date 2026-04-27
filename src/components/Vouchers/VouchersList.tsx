
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VoucherIssuance } from '../../types/individual';
import { formatDateTime } from '../../utils/helpers';
import { Ticket, QrCode, TrendingUp } from 'lucide-react';
import QRCode from "react-qr-code";

interface VouchersListProps {
  vouchers: VoucherIssuance[];
}

const VouchersList: React.FC<VouchersListProps> = ({ vouchers }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
            ✓ Active
          </Badge>
        );
      case 'used':
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-semibold">
            ✓ Used
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 font-semibold">
            ✗ Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="font-semibold">{status}</Badge>;
    }
  };

  const activeCount = vouchers.filter(v => v.statusName === 'active').length;
  const usedCount = vouchers.filter(v => v.statusName === 'used').length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Active</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs text-slate-600 font-semibold uppercase">Used</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{usedCount}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-600 font-semibold uppercase">Total</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{vouchers.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
        {vouchers.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 mx-auto mb-4 opacity-30 text-slate-400" />
            <p className="text-slate-500 font-semibold">No vouchers available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">ID</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Beneficiary</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Restaurant</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Meals</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Issued</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Expires</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <TableCell className="font-black text-slate-900">{voucher.id}</TableCell>
                    <TableCell className="text-slate-700 font-semibold">{voucher.beneficiaryName}</TableCell>
                    <TableCell className="text-slate-700">{voucher.restaurantName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        {voucher.numberOfMeals}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(voucher.statusName)}</TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDateTime(voucher.createdAt)}</TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDateTime(voucher.expiryDate)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <QRCode value={voucher.qrCode} size={60} level="H" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VouchersList;
