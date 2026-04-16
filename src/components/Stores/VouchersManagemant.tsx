import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Ticket } from "lucide-react";

interface Voucher {
  id: string;
  beneficiaryName: string;
  basketName: string;
  issueDate: string;
  status: "pending" | "received";
}

export function VouchersManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 لاحقاً هون منجيب البيانات من الباك
  useEffect(() => {
    setLoading(false);
  }, []);

  const markAsReceived = (voucherId: string) => {
    setVouchers(vouchers.map(v => 
      v.id === voucherId ? { ...v, status: "received" } : v
    ));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6" dir="rtl">
        <Ticket className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl text-gray-900">إدارة القسائم</h2>
      </div>

      <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">

        {loading ? (
          <p className="text-gray-500 text-center py-6">جاري التحميل...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-gray-500 text-center py-6">لا توجد قسائم حالياً</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-beige-50">
                  <TableHead className="text-right text-base text-gray-700">رقم القسيمة</TableHead>
                  <TableHead className="text-right text-base text-gray-700">اسم المستفيد</TableHead>
                  <TableHead className="text-right text-base text-gray-700">اسم السلة</TableHead>
                  <TableHead className="text-right text-base text-gray-700">تاريخ الإصدار</TableHead>
                  <TableHead className="text-right text-base text-gray-700">الحالة</TableHead>
                  <TableHead className="text-right text-base text-gray-700">الإجراء</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="text-right font-medium">{voucher.id}</TableCell>
                    <TableCell className="text-right">{voucher.beneficiaryName}</TableCell>
                    <TableCell className="text-right">{voucher.basketName}</TableCell>
                    <TableCell className="text-right">{voucher.issueDate}</TableCell>

                    <TableCell className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          voucher.status === "received"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {voucher.status === "received" ? "تم الاستلام" : "قيد الانتظار"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      {voucher.status === "pending" ? (
                        <Button
                          onClick={() => markAsReceived(voucher.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          تم الاستلام
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">مكتمل</span>
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
}
