import { useEffect, useState } from "react";
import { getAllFoodBonds } from "@/api/Admin/FoodBond/getallfoodBond";
import { createFoodBond } from "@/api/Admin/FoodBond/createfoodBond";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

export default function FoodBondsPage() {
  const navigate = useNavigate();

  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    beneficiaryName: "",
    restaurantName: "",
    numberOfMeals: "",
    expiryDate: "",
  });

  const loadBonds = async () => {
    const data = await getAllFoodBonds();
    setBonds(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBonds();
  }, []);

  const handleCreate = async () => {
    if (
      !form.beneficiaryName ||
      !form.restaurantName ||
      !form.numberOfMeals ||
      !form.expiryDate
    ) {
      setMessage("⚠️ الرجاء تعبئة جميع الحقول");
      return;
    }

    setCreating(true);
    setMessage("");

    try {
      const payload = {
        beneficiaryName: form.beneficiaryName,
        restaurantName: form.restaurantName,
        numberOfMeals: Number(form.numberOfMeals),
        expiryDate: form.expiryDate,
      };

      await createFoodBond(payload);

      setMessage("تم إنشاء السند بنجاح");

      await loadBonds();

      setForm({
        beneficiaryName: "",
        restaurantName: "",
        numberOfMeals: "",
        expiryDate: "",
      });
    } catch (err) {
      setMessage("❌ فشل إنشاء السند");
    }

    setCreating(false);
  };

  const downloadQR = (code: string) => {
    const svg = document.getElementById(`qr-${code}`);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${code}.svg`;
    a.click();
  };

  if (loading) return <div className="p-6">جاري تحميل السندات...</div>;

  const restaurants = [...new Set(bonds.map((b: any) => b.restaurantName))];

  const filtered = bonds
    .filter((b: any) =>
      b.beneficiaryName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((b: any) =>
      statusFilter === "all" ? true : b.statusName === statusFilter
    )
    .filter((b: any) =>
      restaurantFilter === "all" ? true : b.restaurantName === restaurantFilter
    );

  return (
    <div className="p-6 space-y-10">

      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        السندات الغذائية
      </h1>

      {/* FORM */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-white">
          إنشاء سند جديد
        </h2>

        {message && (
          <div className="mb-4 text-sm font-medium text-center text-blue-700 dark:text-blue-300">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="اسم المستفيد"
            className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
            value={form.beneficiaryName}
            onChange={(e) =>
              setForm({ ...form, beneficiaryName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="اسم المطعم"
            className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
            value={form.restaurantName}
            onChange={(e) =>
              setForm({ ...form, restaurantName: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="عدد الوجبات"
            className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
            value={form.numberOfMeals}
            onChange={(e) =>
              setForm({ ...form, numberOfMeals: e.target.value })
            }
          />

          <input
            type="date"
            className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
            value={form.expiryDate}
            onChange={(e) =>
              setForm({ ...form, expiryDate: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {creating ? "جاري الإنشاء..." : "إنشاء السند"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="ابحث عن مستفيد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white w-full md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
        >
          <option value="all">كل الحالات</option>
          <option value="Received">مستلم</option>
          <option value="Pending">قيد الانتظار</option>
          <option value="Expired">منتهي</option>
        </select>

        <select
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-700 dark:text-white"
        >
          <option value="all">كل المطاعم</option>
          {restaurants.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((b: any) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                {b.beneficiaryName}
              </h2>

              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    b.statusName === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.statusName === "Received"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {b.statusName === "Received"
                  ? "مستلم"
                  : b.statusName === "Pending"
                  ? "قيد الانتظار"
                  : "منتهي"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <p>🍽️ المطعم: <span className="font-medium">{b.restaurantName}</span></p>
              <p>🥗 عدد الوجبات: <span className="font-medium">{b.numberOfMeals}</span></p>
              <p>⏳ ينتهي في: <span className="font-medium">{b.expiryDate?.split("T")[0]}</span></p>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="bg-white p-2 rounded-md shadow">
                <QRCode id={`qr-${b.qrCode}`} value={b.qrCode} size={120} />
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate(`/admin/food-bonds/${b.id}`)}
                className="text-blue-600 hover:underline text-sm"
              >
                عرض التفاصيل
              </button>

              <button
                onClick={() => downloadQR(b.qrCode)}
                className="text-green-600 hover:underline text-sm"
              >
                تحميل QR
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400 text-center">
              رقم السند: {b.qrCode}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
