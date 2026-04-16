import { useState } from "react";
import { registerUser } from "@/api/User/register";

export function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "Store Owner",
  });

  const roleMap: any = {
    "Beneficiary": "Beneficiary",
    "Store Owner": "Store Owner",
    "Shelter Owner": "ShelterOwner",
    "Donor": "Donor",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({
        ...form,
        role: roleMap[form.role],   // ⭐ أهم سطر
      });

      alert("تم إنشاء الحساب بنجاح");
    } catch {
      alert("فشل إنشاء الحساب");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <input
        type="text"
        placeholder="الاسم الكامل"
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />

      <input
        type="email"
        placeholder="الإيميل"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="كلمة المرور"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="text"
        placeholder="رقم الهاتف"
        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="Store Owner">صاحب متجر</option>
        <option value="Shelter Owner">صاحب مأوى</option>
        <option value="Beneficiary">مستفيد</option>
        <option value="Donor">متبرع</option>
      </select>

      <button type="submit">إنشاء حساب</button>
    </form>
  );
}