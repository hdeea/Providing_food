import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DonationIndividualDto } from '../../types/individual';
import { Heart, CheckCircle, XCircle, Clock, Leaf, MapPin } from 'lucide-react';

interface IndividualDonorsTableProps {
  donors: DonationIndividualDto[];
  onStatusChange: (donorId: number, newStatus: 'Approved' | 'Rejected') => void;
}

const IndividualDonorsTable: React.FC<IndividualDonorsTableProps> = ({ donors, onStatusChange }) => {
  const getStatusBadge = (status: string) => {
    const capitalStatus = status.charAt(0).toUpperCase() + status.slice(1);
    switch (capitalStatus) {
      case 'Approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 font-semibold">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const pendingCount = donors.filter(d => d.status === 'Pending').length;
  const approvedCount = donors.filter(d => d.status === 'Approved').length;
  const rejectedCount = donors.filter(d => d.status === 'Rejected').length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-600 font-semibold uppercase">Pending</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Approved</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs text-rose-600 font-semibold uppercase">Rejected</p>
          <p className="text-2xl font-black text-rose-700 mt-1">{rejectedCount}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-600 font-semibold uppercase">Total</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{donors.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
        {donors.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30 text-slate-400" />
            <p className="text-slate-500 font-semibold">No donation requests available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">ID</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Food Name</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Description</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Location</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.foodId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <TableCell className="font-black text-slate-900">#{donor.foodId}</TableCell>
                    <TableCell className="text-slate-700 font-semibold">{donor.foodName}</TableCell>
                    <TableCell className="text-slate-600 max-w-xs truncate">{donor.description || 'No description'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {donor.country}
                      </span>
                    </TableCell>
                    <TableCell>
                      {donor.vegetarian ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-sm font-semibold">
                          <Leaf className="w-3 h-3" />
                          Vegetarian
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-sm font-semibold">
                          Non-Veg
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(donor.status)}</TableCell>
                    <TableCell>
                      {donor.status === 'Pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={() => onStatusChange(donor.requesId, 'Approved')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="font-semibold"
                            onClick={() => onStatusChange(donor.requesId, 'Rejected')}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
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

export default IndividualDonorsTable;
