import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpRequest } from "@/types/individual";
import { CheckCircle, XCircle, Phone, Users, Calendar, User, FileImage, Eye } from "lucide-react";

interface Props {
  requests: HelpRequest[];
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
}

const RequestsCards: React.FC<Props> = ({ requests, onStatusChange }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 font-semibold">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold">
            Pending Review
          </Badge>
        );
    }
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  return (
    <div className="space-y-6">
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
          <p className="text-2xl font-black text-blue-700 mt-1">{requests.length}</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{req.name}</h3>
                  <p className="text-sm text-slate-500">ID: #{req.id}</p>
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{req.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{req.numberOfPeople} family members</span>
              </div>

              <div className="text-sm text-slate-600">
                <span className="font-semibold">Marital Status:</span> {req.maritalStatus}
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{req.createdAt}</span>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative group">
                <img
                  src={req.maritalStatusImage}
                  alt="Marital Status Proof"
                  className="w-full h-20 object-cover rounded-lg border border-slate-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="relative group">
                <img
                  src={req.familySizeImage}
                  alt="Family Size Proof"
                  className="w-full h-20 object-cover rounded-lg border border-slate-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Actions */}
            {req.status === "pending" && (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  onClick={() => onStatusChange(req.id, "approved")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 font-semibold"
                  onClick={() => onStatusChange(req.id, "rejected")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsCards;
