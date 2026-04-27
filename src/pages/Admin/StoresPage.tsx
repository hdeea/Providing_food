import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Store, MapPin, Phone, Package, Calendar, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllStoreRequests } from '@/api/Admin/getAllStoreRequests';
import { approveStoreRequest } from '@/api/Admin/approveStoreRequest';
import { rejectStoreRequest } from '@/api/Admin/rejectStoreRequest';

interface Store {
  storeRequestId?: number;
  id?: number;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  status?: string;
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  name?: string;
  location?: string;
  phone?: string;
  totalRequests?: number;
  approvedRequests?: number;
}

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await getAllStoreRequests();
        console.log("Stores data:", data);
        setStores(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل بيانات المتاجر',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const getStatusBadge = (status?: string) => {
    const statusStr = (status || '').toLowerCase();
    switch (statusStr) {
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-semibold">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-semibold">
            {status || 'Unknown'}
          </Badge>
        );
    }
  };

  const handleApprove = async (storeId?: number) => {
    if (!storeId) return;
    try {
      await approveStoreRequest(storeId);
      setStores(stores.map(s => 
        (s.storeRequestId === storeId || s.id === storeId) 
          ? { ...s, status: 'approved' } 
          : s
      ));
      toast({
        title: 'تم',
        description: 'تم الموافقة على المتجر',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل الموافقة على المتجر',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (storeId?: number) => {
    if (!storeId) return;
    try {
      await rejectStoreRequest(storeId);
      setStores(stores.map(s => 
        (s.storeRequestId === storeId || s.id === storeId) 
          ? { ...s, status: 'rejected' } 
          : s
      ));
      toast({
        title: 'تم',
        description: 'تم رفض المتجر',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل رفض المتجر',
        variant: 'destructive',
      });
    }
  };

  const activeCount = stores.filter(s => (s.status || '').toLowerCase() === 'approved').length;
  const pendingCount = stores.filter(s => (s.status || '').toLowerCase() === 'pending').length;
  const rejectedCount = stores.filter(s => (s.status || '').toLowerCase() === 'rejected').length;

  if (loading) {
    return (
      <DashboardLayout title="Stores Management">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
            <p className="text-slate-600 font-semibold">Loading stores...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Stores Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600 font-semibold uppercase">Approved</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs text-amber-600 font-semibold uppercase">Pending</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600 font-semibold uppercase">Rejected</p>
            <p className="text-2xl font-black text-slate-700 mt-1">{rejectedCount}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase">Total</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{stores.length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
          {stores.length === 0 ? (
            <div className="text-center py-16">
              <Store className="w-16 h-16 mx-auto mb-4 opacity-30 text-slate-400" />
              <p className="text-slate-500 font-semibold">No stores available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">ID</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Store Name</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Location</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Phone</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Created</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.storeRequestId || store.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <TableCell className="font-black text-slate-900">#{store.storeRequestId || store.id}</TableCell>
                      <TableCell className="text-slate-700 font-semibold">{store.storeName || store.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3" />
                          {store.storeAddress || store.location}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Phone className="w-3 h-3" />
                          {store.storePhone || store.phone}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(store.status)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                          <Calendar className="w-3 h-3" />
                          {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(store.status || '').toLowerCase() === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                onClick={() => handleApprove(store.storeRequestId || store.id)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="font-semibold text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleReject(store.storeRequestId || store.id)}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {(store.status || '').toLowerCase() !== 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-semibold"
                            >
                              View Details
                            </Button>
                          )}
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
    </DashboardLayout>
  );
};

export default StoresPage;