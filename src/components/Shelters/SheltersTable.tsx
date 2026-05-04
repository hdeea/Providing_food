import React from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Shelter } from "@/types/Shelter";

interface Props {
  shelters: Shelter[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  showActions?: boolean;
}

const SheltersTable: React.FC<Props> = ({
  shelters,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  showActions = false,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full text-center">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="p-3">رقم الملجأ</th>
            <th className="p-3">اسم الملجأ</th>
            <th className="p-3">الوصف</th>
            <th className="p-3">الصورة</th>
            <th className="p-3">الحالة</th>
            <th className="p-3">تاريخ الإنشاء</th>
            {showActions && <th className="p-3">الإجراءات</th>}
          </tr>
        </thead>

        <tbody>
          {shelters.map((shelter) => (
            <tr key={shelter.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{shelter.id}</td>
              <td className="p-3">{shelter.name}</td>
              <td className="p-3">{shelter.description}</td>

              <td className="p-3">
                <img
                  src={shelter.proofImageUrl}
                  alt="Proof"
                  className="w-16 h-16 object-cover rounded"
                />
              </td>

              <td className="p-3">
                {shelter.status === "Approved" && (
                  <span className="text-green-600 font-bold">Approved</span>
                )}
                {shelter.status === "Pending" && (
                  <span className="text-yellow-600 font-bold">Pending</span>
                )}
                {shelter.status === "Rejected" && (
                  <span className="text-red-600 font-bold">Rejected</span>
                )}
              </td>

              <td className="p-3">
                {new Date(shelter.createdAt).toLocaleDateString("ar-SY")}
              </td>

              {showActions && (
                <td className="p-3 flex justify-center gap-3">
                  {onApprove && (
                    <button
                      onClick={() => onApprove(shelter.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={20} />
                    </button>
                  )}

                  {onReject && (
                    <button
                      onClick={() => onReject(shelter.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  )}

                  {onEdit && (
                    <button
                      onClick={() => onEdit(shelter.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(shelter.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SheltersTable;
