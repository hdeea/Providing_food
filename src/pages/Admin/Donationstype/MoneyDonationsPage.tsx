import { useEffect, useState } from "react";
import { getMoneyDonations } from "@/api/Admin/Donations/getMoneyDonations";

export default function MoneyDonationsPage() {
  const token = localStorage.getItem("token");

  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getMoneyDonations(token, "");
    setDonations(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔍 فلترة محلية (Frontend Filtering)
  const filtered = donations.filter((d) => {
    const text = search.toLowerCase();

    const matchesSearch =
      d.fullName?.toLowerCase().includes(text) ||
      d.email?.toLowerCase().includes(text) ||
      d.phoneNumber?.toLowerCase().includes(text) ||
      d.regionName?.toLowerCase().includes(text) ||
      String(d.amount).includes(text);

    const matchesStatus =
      statusFilter === "all" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div dir="rtl" className="px-10 py-12 space-y-8">

      <h1 className="text-2xl font-bold text-slate-900">التبرعات المالية</h1>

      {/* 🔍 البحث + الفلترة */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 
                      flex flex-col md:flex-row gap-3 items-center transition-all">

        {/* شريط بحث صغير */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="بحث..."
            className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm 
                       focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            🔍
          </span>
        </div>

        {/* فلترة الحالة */}
        <select
          className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm 
                     focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="Paid">مدفوع</option>
          <option value="Pending">قيد الانتظار</option>
        </select>
      </div>

      {/* جدول التبرعات */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">

        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4 font-medium">#</th>
              <th className="p-4 font-medium">الاسم</th>
              <th className="p-4 font-medium">البريد</th>
              <th className="p-4 font-medium">الهاتف</th>
              <th className="p-4 font-medium">المنطقة</th>
              <th className="p-4 font-medium">المبلغ</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">التاريخ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((d, i) => (
              <tr
                key={i}
                className="hover:bg-emerald-50/40 transition-all cursor-pointer"
              >
                <td className="p-4 text-slate-500">{i + 1}</td>
                <td className="p-4 font-medium">{d.fullName}</td>
                <td className="p-4 text-slate-500">{d.email ?? "—"}</td>
                <td className="p-4">{d.phoneNumber}</td>
                <td className="p-4">{d.regionName ?? "—"}</td>
                <td className="p-4 font-mono">{d.amount} ل.س</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status ?? "—"}
                  </span>
                </td>

                <td className="p-4 text-slate-500">
                  {d.createdAt
                    ? new Date(d.createdAt).toLocaleString("ar-EG")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}
