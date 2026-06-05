import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";

export default function VoucherScanAndRedeem() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reader] = useState(() => new BrowserMultiFormatReader());
  const [isScanning, setIsScanning] = useState(false);

  const [voucher, setVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const startCamera = async () => {
    setError("");
    setMessage("");
    setVoucher(null);

    try {
      setIsScanning(true);

      await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result: Result | undefined) => {
          if (result) {
            stopCamera();
            handleScan(result.getText());
          }
        }
      );
    } catch {
      setError("لا يمكن تشغيل الكاميرا. تحقق من الأذونات.");
    }
  };

  const stopCamera = () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    } catch {}

    setIsScanning(false);
  };

  const handleScan = async (qrCode: string) => {
    try {
      const res = await fetch(`/api/voucher/${qrCode}`);
      if (!res.ok) throw new Error("القسيمة غير موجودة");

      const data = await res.json();
      setVoucher(data);
      setMessage("تم مسح القسيمة بنجاح");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirm = async () => {
  if (!voucher?.qrCode) return;

  setLoadingConfirm(true);
  setError("");
  setMessage("");

  try {
    const res = await fetch(`/api/voucher/redeem/${voucher.qrCode}`, {
      method: "POST",
    });

    if (!res.ok) {
  let errorMessage = "فشل تأكيد الاستلام";

  // نقرأ الـ body مرة واحدة فقط
  const body = await res.text();

  try {
    // نحاول نفكّه كـ JSON
    const data = JSON.parse(body);
    errorMessage =
      data.Error || data.error || data.message || errorMessage;
  } catch {
    // لو مو JSON (StackTrace)، نقص أول سطر فقط
    errorMessage = body.split("\n")[0].split("at ")[0].trim();
  }

  throw new Error(errorMessage);
}


    setMessage("تم تأكيد استلام القسيمة بنجاح");
    setVoucher({ ...voucher, status: "Used" });
    setShowSuccessModal(true);
  } catch (err: any) {
    setError(err.message);
  }

  setLoadingConfirm(false);
};


  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            مسح قسيمة وتأكيد الاستلام
          </h1>
          <p className="text-slate-600 text-lg">
            استخدم كاميرا الجهاز لمسح رمز QR الخاص بالقسيمة، ثم راجع التفاصيل وقم بتأكيد الاستلام.
          </p>
        </div>

        {(error || message) && (
          <div
            className={`rounded-2xl px-5 py-4 text-sm shadow-md ${
              error
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-[1.5fr,1fr] items-start">

          {/* Scanner */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-6 space-y-6">

            <h2 className="text-xl font-bold text-slate-900">مسح QR بالكاميرا</h2>

            <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] shadow-inner">
              <video ref={videoRef} className="w-full h-full object-cover" />

              {isScanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 max-w-sm aspect-square rounded-3xl border-[3px] border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                    <div className="absolute inset-x-6 top-1/2 h-[3px] bg-emerald-400/80 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm shadow hover:bg-slate-800 transition"
                >
                  بدء المسح بالكاميرا
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-semibold text-sm shadow hover:bg-red-500 transition"
                >
                  إيقاف الكاميرا
                </button>
              )}
            </div>
          </div>

          {/* Voucher Details */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-6 space-y-6 min-h-[260px]">

            <h2 className="text-xl font-bold text-slate-900">تفاصيل القسيمة</h2>

            {!voucher ? (
              <p className="text-slate-400 text-sm">
                لم يتم مسح أي قسيمة بعد. وجّه الكاميرا نحو رمز QR.
              </p>
            ) : (
              <div className="space-y-4 text-slate-700 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">رقم القسيمة</span>
                  <span className="font-semibold">{voucher.voucherId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">المستفيد</span>
                  <span>{voucher.beneficiaryName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">المتجر</span>
                  <span>{voucher.storeName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">الموقع</span>
                  <span>{voucher.storeLocation}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">عدد السلال</span>
                  <span>{voucher.basketCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">تاريخ الانتهاء</span>
                  <span>{voucher.expiryDate?.split("T")[0]}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">الحالة</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {voucher.status}
                  </span>
                </div>

{voucher.status !== "Used" && (
  <button
    onClick={handleConfirm}
    disabled={loadingConfirm}
    className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm shadow hover:bg-emerald-500 transition disabled:opacity-60"
  >
    {loadingConfirm ? "جاري التأكيد..." : "تأكيد استلام القسيمة"}
  </button>
)}


              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-[90%] max-w-md text-center space-y-4 animate-[fadeIn_0.3s]">
            <div className="text-emerald-600 text-6xl font-bold">✓</div>
            <h3 className="text-2xl font-bold text-slate-900">تم التأكيد بنجاح</h3>
            <p className="text-slate-600">تم تسجيل استلام القسيمة لهذا المستفيد.</p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 w-full py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
