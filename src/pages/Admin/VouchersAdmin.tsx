import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

// API
import { generateVoucher } from "@/api/Admin/generateVoucher";
import { acknowledgeVoucher } from "@/api/Admin/acknowledgeVoucher";
import { useAuth } from "@/contexts/AuthContext";
import { getVoucherQR } from "@/api/Admin/getVoucherQR";

interface Voucher {
  voucherId: number;
  beneficiaryId: number;
  beneficiaryName: string;
  storeName: string;
  storeLocation: string;
  basketCount: number;
  expiryDate: string;
  qrCode: string;
  status: string;
  createdAt: string;
  usedAt?: string;
}

export function VouchersAdmin() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = user?.token;

  const [qrImage, setQrImage] = useState<string | null>(null);

  // فورم إنشاء قسيمة
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiaryId: "",
    beneficiaryName: "",
    storeName: "",
    storeLocation: "",
    basketCount: "",
    expiryDate: ""
  });

  const showQR = async (code: string) => {
    try {
      const blob = await getVoucherQR(token, code);
      const url = URL.createObjectURL(blob);
      setQrImage(url);
    } catch (err) {
      console.error("Error loading QR:", err);
    }
  };

  // Load ALL vouchers
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/voucher/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        console.error("Error loading vouchers:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  // Helper function to check if expiry date has passed
  const isExpired = (expiryDate: string): boolean => {
    try {
      const expiry = new Date(expiryDate);
      const now = new Date();
      return expiry < now;
    } catch {
      return false;
    }
  };

  // Determine actual status based on status and expiryDate
  const getActualStatus = (voucher: Voucher): 'pending' | 'used' | 'expired' => {
    const statusLower = (voucher.status || '').toLowerCase();
    
    // If status is already "used", show as used
    if (statusLower === 'used') {
      return 'used';
    }
    
    // If expiry date has passed, show as expired
    if (isExpired(voucher.expiryDate)) {
      return 'expired';
    }
    
    // Otherwise show as pending
    return 'pending';
  };

  // Calculate statistics
  const pendingCount = vouchers.filter(v => getActualStatus(v) === 'pending').length;
  const usedCount = vouchers.filter(v => getActualStatus(v) === 'used').length;
  const expiredCount = vouchers.filter(v => getActualStatus(v) === 'expired').length;

  // إنشاء قسيمة جديدة
  const handleGenerate = async () => {
    try {
      const body = {
        beneficiaryId: Number(formData.beneficiaryId),
        beneficiaryName: formData.beneficiaryName,
        storeName: formData.storeName,
        storeLocation: formData.storeLocation,
        basketCount: Number(formData.basketCount),
        expiryDate: formData.expiryDate + "T00:00:00"
      };

      const newVoucher = await generateVoucher(token, body);
console.log("NEW VOUCHER RESPONSE:", newVoucher);
      setVouchers(prev => [newVoucher, ...prev]);

      // إغلاق الفورم
      setShowForm(false);
      setFormData({
        beneficiaryId: "",
        beneficiaryName: "",
        storeName: "",
        storeLocation: "",
        basketCount: "",
        expiryDate: ""
      });

    } catch (err) {
      console.error("Error generating voucher:", err);
    }
  };

  // تحديث حالة القسيمة
  const markAsReceived = async (code: string) => {
    try {
      await acknowledgeVoucher(code, token);
      setVouchers(prev =>
        prev.map(v =>
          v.qrCode === code ? { ...v, status: "Used" } : v
        )
      );
    } catch (err) {
      console.error("Error acknowledging voucher:", err);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl text-gray-900">إدارة القسائم</h2>
      </div>

      <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-xs text-yellow-600 font-semibold uppercase">قيد الانتظار</p>
            <p className="text-2xl font-black text-yellow-700 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-xs text-green-600 font-semibold uppercase">تم الاستخدام</p>
            <p className="text-2xl font-black text-green-700 mt-1">{usedCount}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs text-red-600 font-semibold uppercase">منتهي الصلاحية</p>
            <p className="text-2xl font-black text-red-700 mt-1">{expiredCount}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase">الإجمالي</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{vouchers.length}</p>
          </div>
        </div>

        {/* زر إنشاء قسيمة */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">كل القسائم</h3>

          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            إنشاء قسيمة جديدة
          </Button>
        </div>

        {/* فورم إنشاء قسيمة */}
        {showForm && (
          <div className="bg-gray-50 p-4 rounded-xl border mb-6">

            <div className="grid grid-cols-2 gap-4">

              <input
                className="border p-2 rounded"
                placeholder="اسم المستفيد"
                value={formData.beneficiaryName}
                onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                placeholder="اسم المتجر"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                placeholder="موقع المتجر"
                value={formData.storeLocation}
                onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                placeholder="عدد السلال"
                type="number"
                value={formData.basketCount}
                onChange={(e) => setFormData({ ...formData, basketCount: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />

            </div>

            <div className="flex gap-3 mt-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleGenerate}
              >
                إنشاء
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </Button>
            </div>

          </div>
        )}

        {/* جدول القسائم */}
        {loading ? (
          <p className="text-center text-gray-500 py-6">جاري التحميل...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-center text-gray-500 py-6">لا توجد قسائم حالياً</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم القسيمة</TableHead>
                  <TableHead className="text-right">اسم المستفيد</TableHead>
                  <TableHead className="text-right">اسم المتجر</TableHead>
                  <TableHead className="text-right">عدد السلال</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">QR</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vouchers.map((v) => {
                  const actualStatus = getActualStatus(v);

                  return (
                    <TableRow key={v.voucherId}>
                      <TableCell className="text-right">{v.qrCode}</TableCell>
                      <TableCell className="text-right">{v.beneficiaryName}</TableCell>
                      <TableCell className="text-right">{v.storeName}</TableCell>
                      <TableCell className="text-right">{v.basketCount}</TableCell>
                      <TableCell className="text-right">
                        {new Date(v.createdAt).toLocaleDateString("ar-EG")}
                      </TableCell>

                      <TableCell className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            actualStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : actualStatus === "used"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {actualStatus === "pending"
                            ? "قيد الانتظار"
                            : actualStatus === "used"
                            ? "تم الاستخدام"
                            : "منتهي الصلاحية"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => showQR(v.qrCode)}
                        >
                          عرض QR
                        </Button>
                      </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </div>
        )}
      </div>

      {/* QR Popup */}
      {qrImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <img src={qrImage} alt="QR Code" className="w-64 h-64 mx-auto" />
            <Button
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setQrImage(null)}
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
