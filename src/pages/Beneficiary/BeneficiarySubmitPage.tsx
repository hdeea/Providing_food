import { useState } from "react";
import { submitBeneficiary } from "@/api/Beneficiary/submitBeneficiary";

export default function BeneficiarySubmitPage() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [familySize, setFamilySize] = useState(1);
  const [maritalStatus, setMaritalStatus] = useState("");

  const [maritalStatusProof, setMaritalStatusProof] = useState<File | null>(null);
  const [familySizeProof, setFamilySizeProof] = useState<File | null>(null);
  
const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("يجب تسجيل الدخول أولاً");
    return;
  }

  let maritalBase64 = "";
  let familyBase64 = "";

  if (maritalStatusProof) {
    maritalBase64 = await convertToBase64(maritalStatusProof);
  }

  if (familySizeProof) {
    familyBase64 = await convertToBase64(familySizeProof);
  }

  const body = {
    fullName,
    phoneNumber,
    familySize,
    maritalStatus,
    maritalStatusProofImage: maritalBase64,
    familySizeProofImage: familyBase64,
      status: "Pending"   // ⭐ أهم سطر
  };

  try {
    const response = await fetch("/api/Beneficiary/submit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    alert("تم إرسال الطلب بنجاح");
  } catch (err) {
    alert("حدث خطأ أثناء الإرسال");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-200">

        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          تسجيل مستفيد
        </h2>

        <div className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">الاسم الكامل</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="أدخل اسمك الكامل"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">رقم الهاتف</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="09xxxxxxxx"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Family Size */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">عدد أفراد العائلة</label>
            <input
              type="number"
              min="1"
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              onChange={(e) => setFamilySize(Number(e.target.value))}
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">الحالة الاجتماعية</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="أعزب / متزوج / أرمل..."
              onChange={(e) => setMaritalStatus(e.target.value)}
            />
          </div>

          {/* Marital Status Proof */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">
              صورة إثبات الحالة الاجتماعية
            </label>

            <div className="border border-green-300 rounded-xl p-4 bg-green-50 flex flex-col items-center gap-3">

              {maritalStatusProof && (
                <img
                  src={URL.createObjectURL(maritalStatusProof)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg shadow"
                />
              )}

              <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                اختر صورة
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setMaritalStatusProof(e.target.files?.[0] || null)}
                />
              </label>

              {maritalStatusProof && (
                <p className="text-sm text-green-700">{maritalStatusProof.name}</p>
              )}
            </div>
          </div>

          {/* Family Size Proof */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">
              صورة إثبات عدد العائلة
            </label>

            <div className="border border-green-300 rounded-xl p-4 bg-green-50 flex flex-col items-center gap-3">

              {familySizeProof && (
                <img
                  src={URL.createObjectURL(familySizeProof)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg shadow"
                />
              )}

              <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                اختر صورة
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFamilySizeProof(e.target.files?.[0] || null)}
                />
              </label>

              {familySizeProof && (
                <p className="text-sm text-green-700">{familySizeProof.name}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl text-lg font-semibold shadow-md"
          >
            إرسال الطلب
          </button>

        </div>
      </div>
    </div>
  );
}
