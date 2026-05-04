import React from "react";
import { Check, X } from "lucide-react";
import { Shelter } from "@/types/Shelter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface Props {
  shelter: Shelter;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const ShelterCard: React.FC<Props> = ({ shelter, onApprove, onReject }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
      {/* صورة مع تكبير */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <img
              src={`https://localhost:7060${shelter.proofImageUrl}`}
              className="w-full h-40 object-cover rounded-lg mb-3"
              alt="Proof"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <img
            src={`https://localhost:7060${shelter.proofImageUrl}`}
            className="w-full h-auto rounded-lg"
            alt="Proof enlarged"
          />
        </DialogContent>
      </Dialog>

      <h3 className="text-xl font-bold">{shelter.name}</h3>
      <p className="text-gray-600 mt-1">{shelter.description}</p>

      <p className="mt-2 font-semibold">
        الحالة:
        {shelter.status === "Approved" && (
          <span className="text-green-600 ml-1">Approved</span>
        )}
        {shelter.status === "Pending" && (
          <span className="text-yellow-600 ml-1">Pending</span>
        )}
        {shelter.status === "Rejected" && (
          <span className="text-red-600 ml-1">Rejected</span>
        )}
      </p>

      <div className="flex justify-between mt-4">
        {onApprove && (
          <button
            onClick={() => onApprove(shelter.id)}
            className="text-green-600 hover:text-green-800"
          >
            <Check size={22} />
          </button>
        )}

        {onReject && (
          <button
            onClick={() => onReject(shelter.id)}
            className="text-red-600 hover:text-red-800"
          >
            <X size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ShelterCard;
