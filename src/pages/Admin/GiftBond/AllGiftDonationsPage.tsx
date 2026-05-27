import { useEffect, useMemo, useState } from "react";
import { getAllGiftDonations } from "@/api/GiftBond/giftBond";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Ticket,
  DollarSign,
  Hash,
  Info,
  CheckCircle2,
  Clock3,
  X,
  Download,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 🔥 غيّري هالقيمة لتبديل ستايل التفاصيل
const DETAILS_STYLE: "stripe" | "notion" | "linear" = "linear";

type GiftDonation = {
  giftDonationId: number;
  donorUserId: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  numberOfBonds: number;
  bondPrice: number;
  totalAmount: number;
  regionId: number;
  regionName: string | null;
  stripeSessionId: string;
  paymentIntentId: string | null;
  status: "Paid" | "Pending" | string;
  createdAt: string;
};
const showCopyToastNearButton = (button: HTMLElement) => {
  const rect = button.getBoundingClientRect();

  const toast = document.createElement("div");
  toast.innerText = "تم النسخ ✓";

  toast.className = `
    fixed
    bg-[#166534]
    text-white
    px-3 py-1
    rounded-md
    text-xs
    shadow-lg
    animate-fade
    z-[99999]
  `;

  // تحديد مكان التوست بجانب الزر
  toast.style.top = rect.top - 35 + "px";
  toast.style.left = rect.left + "px";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
  }, 1000);

  setTimeout(() => {
    toast.remove();
  }, 1500);
};


export default function AllGiftDonationsPage() {
  const [rows, setRows] = useState<GiftDonation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Paid" | "Pending">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<GiftDonation | null>(null);

  useEffect(() => {
    getAllGiftDonations().then(setRows);
  }, []);

  const filtered = useMemo(() => {
    let list = [...rows];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      list = list.filter((d) =>
        `${d.recipientName} ${d.recipientPhone} ${d.recipientAddress} ${d.giftDonationId}`
          .toLowerCase()
          .includes(s)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((d) => d.status === statusFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "date") {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortDesc ? db - da : da - db;
      } else {
        const aa = a.totalAmount ?? 0;
        const ab = b.totalAmount ?? 0;
        return sortDesc ? ab - aa : aa - ab;
      }
    });

    return list;
  }, [rows, search, statusFilter, sortBy, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusBadge = (status: string) => {
    const isPaid = status === "Paid";
    return (
      <span
        className={
          "px-2 py-1 rounded-full text-xs font-semibold " +
          (isPaid
            ? "bg-[#DCFCE7] text-[#166534] dark:bg-[#065F46] dark:text-[#86EFAC]"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300")
        }
      >
        {isPaid ? "مدفوع" : "قيد الانتظار"}
      </span>
    );
  };

  const exportCsv = () => {
    if (!filtered.length) return;
    const header = [
      "giftDonationId",
      "donorUserId",
      "recipientName",
      "recipientPhone",
      "recipientAddress",
      "numberOfBonds",
      "bondPrice",
      "totalAmount",
      "regionId",
      "regionName",
      "stripeSessionId",
      "paymentIntentId",
      "status",
      "createdAt",
    ];
    const lines = [
      header.join(","),
      ...filtered.map((d) =>
        [
          d.giftDonationId,
          d.donorUserId,
          `"${d.recipientName}"`,
          `"${d.recipientPhone}"`,
          `"${d.recipientAddress}"`,
          d.numberOfBonds,
          d.bondPrice,
          d.totalAmount,
          d.regionId,
          `"${d.regionName ?? ""}"`,
          `"${d.stripeSessionId}"`,
          `"${d.paymentIntentId ?? ""}"`,
          d.status,
          d.createdAt,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gift-donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex p-10 gap-10 bg-[#F9FAFB] dark:bg-[#0F172A] min-h-[calc(100vh-64px)]">
      {/* القائمة الرئيسية */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
              إهداءات السندات
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              عرض شامل لكل إهداءات السندات مع البحث، الفلترة، والترتيب.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              عدد الإهداءات: <b>{filtered.length}</b>
            </span>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#166534] text-[#166534] dark:text-[#86EFAC] dark:border-[#86EFAC]"
              onClick={exportCsv}
            >
              <Download size={16} />
              تصدير CSV
            </Button>
          </div>
        </div>

        {/* شريط التحكم */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="بحث بالاسم، الهاتف، العنوان أو ID..."
            className="w-full md:w-64 bg-white dark:bg-[#1E293B] dark:text-white"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1E293B] dark:border-slate-700 dark:text-white"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "Paid" | "Pending")
            }
          >
            <option value="all">كل الحالات</option>
            <option value="Paid">مدفوع</option>
            <option value="Pending">قيد الانتظار</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1E293B] dark:border-slate-700 dark:text-white"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "amount")
            }
          >
            <option value="date">ترتيب حسب التاريخ</option>
            <option value="amount">ترتيب حسب المبلغ</option>
          </select>

          <Button
            variant="outline"
            className="text-sm border-slate-300 dark:border-slate-700 dark:text-white"
            onClick={() => setSortDesc((v) => !v)}
          >
            {sortDesc ? "الأحدث / الأعلى أولاً" : "الأقدم / الأقل أولاً"}
          </Button>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paged.map((d) => (
            <div
              key={d.giftDonationId}
              onClick={() => setSelected(d)}
              className="p-6 bg-white dark:bg-[#1E293B] border border-[#DCFCE7] dark:border-[#065F46] rounded-2xl shadow-sm hover:shadow-md hover:border-[#86EFAC] dark:hover:border-[#86EFAC] transition cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                  <Hash size={14} /> {d.giftDonationId}
                </span>
                {statusBadge(d.status)}
              </div>

              <p className="text-lg font-semibold flex items-center gap-2 text-[#1F2937] dark:text-white">
                <User size={18} className="text-slate-500 dark:text-slate-400" />
                {d.recipientName}
              </p>

              <div className="text-slate-600 dark:text-slate-300 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  {d.recipientPhone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  {d.recipientAddress}
                </p>
                <p className="flex items-center gap-2">
                  <Ticket size={16} className="text-slate-400" />
                  عدد السندات: {d.numberOfBonds}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-slate-400" />
                  المبلغ: {d.totalAmount} ل.س
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(d.createdAt).toLocaleString("ar-SY", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span className="flex items-center gap-1 text-[#166534] dark:text-[#86EFAC] text-[11px]">
                  <Info size={14} />
                  عرض التفاصيل
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-slate-300 dark:border-slate-700 dark:text-white"
          >
            السابق
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border-slate-300 dark:border-slate-700 dark:text-white"
          >
            التالي
          </Button>
        </div>
      </div>

      {/* Panel التفاصيل */}
      {selected && (
        <DetailsPanel
          donation={selected}
          onClose={() => setSelected(null)}
          styleType={DETAILS_STYLE}
        />
      )}
    </div>
  );
}

// أكوردون بسيط
function useAccordion(initial: string[]) {
  const [open, setOpen] = useState<string[]>(initial);
  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const isOpen = (id: string) => open.includes(id);
  return { isOpen, toggle };
}

function DetailsPanel({
  donation,
  onClose,
  styleType,
}: {
  donation: GiftDonation;
  onClose: () => void;
  styleType: "stripe" | "notion" | "linear";
}) {
  const acc = useAccordion(["recipient", "payment", "meta"]);

  const copyToClipboard = (value: string | null | undefined) => {
    if (!value) return;
    navigator.clipboard?.writeText(value);
  };

  const base = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Info size={18} />
          تفاصيل الإهداء #{donation.giftDonationId}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* قسم المستلم */}
        <AccordionSection id="recipient" title="بيانات المستلم" acc={acc}>
          <Row icon={<User size={16} />} label="الاسم" value={donation.recipientName} />
          <Row icon={<Phone size={16} />} label="الهاتف" value={donation.recipientPhone} />
          <Row icon={<MapPin size={16} />} label="العنوان" value={donation.recipientAddress} />
        </AccordionSection>

        {/* قسم الدفع */}
        <AccordionSection id="payment" title="بيانات الدفع" acc={acc}>
          <Row icon={<Ticket size={16} />} label="عدد السندات" value={donation.numberOfBonds} />
          <Row icon={<DollarSign size={16} />} label="السعر" value={donation.bondPrice} />
          <Row icon={<DollarSign size={16} />} label="المجموع" value={donation.totalAmount} />

          <Row
            icon={<Hash size={16} />}
            label="Session ID"
            value={
              <span className="flex items-center gap-2 break-all">
                {donation.stripeSessionId}
                <button
  onClick={(e) => {
    copyToClipboard(donation.stripeSessionId);
    showCopyToastNearButton(e.currentTarget);
  }}
  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
>
  <Copy size={14} />
</button>
  
              </span>
            }
          />

          <Row
            icon={<Hash size={16} />}
            label="Payment Intent"
            value={
              <span className="flex items-center gap-2 break-all">
                {donation.paymentIntentId || "—"}
                {donation.paymentIntentId && (
                  <button
                    onClick={(e) => {
                      copyToClipboard(donation.paymentIntentId);
                      showCopyToastNearButton(e.currentTarget);
                    }}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </span>
            }
          />
        </AccordionSection>

        {/* قسم الميتا */}
        <AccordionSection id="meta" title="معلومات إضافية" acc={acc}>
          <Row
            icon={
              donation.status === "Paid" ? (
                <CheckCircle2 size={16} className="text-[#166534]" />
              ) : (
                <Clock3 size={16} className="text-amber-500" />
              )
            }
            label="الحالة"
            value={donation.status === "Paid" ? "مدفوع" : "قيد الانتظار"}
          />

          <Row icon={<Hash size={16} />} label="Donor ID" value={donation.donorUserId} />
          <Row icon={<Hash size={16} />} label="Region ID" value={donation.regionId} />

          <Row
            icon={<Calendar size={16} />}
            label="التاريخ"
            value={new Date(donation.createdAt).toLocaleString("ar-SY", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          />
        </AccordionSection>
      </div>
    </>
  );

   // 🟦 Stripe
  if (styleType === "stripe") {
    return (
      <div className="w-96 p-6 rounded-2xl shadow-lg space-y-4 sticky top-10 h-fit
        bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white
        border border-[#DCFCE7] dark:border-[#065F46]">
        {base}
      </div>
    );
  }

  // 🟩 Notion
  if (styleType === "notion") {
    return (
      <div className="w-96 p-6 rounded-2xl shadow-sm space-y-4 sticky top-10 h-fit
        bg-[#F9FAFB] dark:bg-[#1E293B] text-[#1F2937] dark:text-white
        border border-[#E5E7EB] dark:border-[#334155]">
        {base}
      </div>
    );
  }

  // 🟪 Linear (الأفخم)
  return (
    <div className="w-96 p-6 rounded-2xl shadow-2xl space-y-4 sticky top-10 h-fit
      bg-white dark:bg-[#0F172A] text-[#1F2937] dark:text-white
      border border-[#DCFCE7] dark:border-[#065F46]">
      {base}
    </div>
  );
}
function AccordionSection({
  id,
  title,
  acc,
  children,
}: {
  id: string;
  title: string;
  acc: { isOpen: (id: string) => boolean; toggle: (id: string) => void };
  children: React.ReactNode;
}) {
  const open = acc.isOpen(id);
  return (
    <div className="border border-[#E5E7EB] dark:border-[#334155] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => acc.toggle(id)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm
        bg-[#F3F4F6] dark:bg-[#1E293B] text-[#1F2937] dark:text-white"
      >
        <span>{title}</span>
        <span className="text-xs">{open ? "إخفاء" : "عرض"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-white dark:bg-[#0F172A]">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({

  icon,
  label,
  value,
}: {

  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;

}) {

  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</span>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-sm text-[#1F2937] dark:text-white break-all">
          {value}
        </div>
      </div>
    </div>
  );
}
