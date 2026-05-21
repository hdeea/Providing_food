// AdminAllStoreRequestsTable.tsx
import { useEffect, useState } from "react";
import { StoreRequests } from "@/types";
import { getAllStoreRequests } from "@/api/Admin/getAllStoreRequests";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Store, MapPin, Phone, Package, Calendar } from "lucide-react";

export default function AdminAllStoreRequestsTable() {
  const [requests, setRequests] = useState<StoreRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStoreRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load all store requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 font-semibold">
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
            {status}
          </Badge>
        );
    }
  };

  const pendingCount = requests.filter(r => r.status.toLowerCase() === 'pending').length;
  const approvedCount = requests.filter(r => r.status.toLowerCase() === 'approved').length;
  const rejectedCount = requests.filter(r => r.status.toLowerCase() === 'rejected').length;
  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          <p className="text-slate-600 font-semibold">Loading store requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Store Requests</h1>
            <p className="text-sm text-slate-500 mt-1">عرض الطلبات حسب الحالة</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Pending', value: 'pending', count: pendingCount },
              { label: 'Approved', value: 'approved', count: approvedCount },
              { label: 'Rejected', value: 'rejected', count: rejectedCount },
              { label: 'All', value: 'all', count: requests.length },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === option.value
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue={statusFilter} value={statusFilter} className="w-full" onValueChange={(value) => setStatusFilter(value as any)}>
        <TabsList className="grid w-full max-w-4xl grid-cols-4 gap-2">
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
        </TabsList>
      </Tabs>

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
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-xs text-purple-600 font-semibold uppercase">Total</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{requests.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-16 h-16 mx-auto mb-4 opacity-30 text-slate-400" />
            <p className="text-slate-500 font-semibold">No store requests available</p>
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
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Baskets</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Contents</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs uppercase tracking-wide">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.requestId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <TableCell className="font-black text-slate-900">#{req.requestId}</TableCell>
                    <TableCell className="text-slate-700 font-semibold">{req.storeName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {req.storeLocation}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3" />
                        {req.phoneNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-sm font-semibold">
                        <Package className="w-3 h-3" />
                        {req.basketCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 max-w-xs truncate">{req.basketContents}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                        <Calendar className="w-3 h-3" />
                        {req.createdAt}
                      </span>
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
}
