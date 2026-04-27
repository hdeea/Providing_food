import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { acknowledgeVoucher } from "@/api/Admin/acknowledgeVoucher";
import { useAuth } from "@/contexts/AuthContext";

export default function ScanVoucher() {
  const { user } = useAuth();
  const token = user?.token;

  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  const handleScan = async (data: any) => {
    if (data) {
      const code = data.text?.trim();
      if (!code) return;

      setResult(code);

      try {
        await acknowledgeVoucher(code, token);
        setMessage("✔ تم استلام القسيمة بنجاح");
      } catch (err: any) {
        setMessage("❌ فشل الاستلام");
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Error:", err);
  };

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-2xl font-bold mb-4">مسح القسيمة</h2>

      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: "100%" }}
      />

      {result && <p className="mt-4">الكود: {result}</p>}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
