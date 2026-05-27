import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpRequest } from "@/types/individual";
import { CheckCircle, XCircle, Phone, Users, Calendar, User, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  requests: HelpRequest[];
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
}

const RequestsCards: React.FC<Props> = ({ requests, onStatusChange }) => {

  // 🔥 دالة ذكية لمعالجة الصور
  const safeImage = (img?: string | null) => {
    if (!img) return "https://placehold.co/150x150?text=No+Image";

    if (/^[A-Za-z0-9+/=]+$/.test(img)) {
      return `data:image/jpeg;base64,${img}`;
    }

    if (img.startsWith("/uploads")) {
      return `http://localhost:7060${img}`;
    }

    return img;
  };

  return (
    <div className="space-y-6">

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {requests
          .filter(r => r.status === "pending") // ⭐ فقط قيد الانتظار
          .map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition"
            >
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

                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold">
                  Pending Review
                </Badge>
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

                {/* Marital Status Image */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <img
                        src={safeImage(req.maritalStatusImage)}
                        className="w-full h-20 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl">
                    <h2 className="sr-only">Marital Status Image</h2>
                    <img
                      src={safeImage(req.maritalStatusImage)}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>

                {/* Family Size Image */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <img
                        src={safeImage(req.familySizeImage)}
                        className="w-full h-20 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl">
                    <h2 className="sr-only">Family Size Image</h2>
                    <img
                      src={safeImage(req.familySizeImage)}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>

              </div>

              {/* Actions */}
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

            </div>
          ))}
      </div>
    </div>
  );
};

export default RequestsCards;
