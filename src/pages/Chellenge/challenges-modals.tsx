import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChallengesInfoModal({ open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-8 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-emerald-700">
            🌙 تحدي 10 أيام خير
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-slate-700"
        >
          <p>
            هذا التحدي يهدف لتوزيع <strong>5000 وجبة</strong> خلال 10 أيام من رمضان.
            يمكنك المشاركة بالتبرع وزيادة الأجر.
          </p>

          <p className="text-sm text-slate-500">
            لعرض تفاصيل التحدي والمشاركة، يجب تسجيل الدخول.
          </p>

          <div className="flex gap-4 mt-6">
            <Link to="/donor/login" className="w-full">
              <Button className="w-full rounded-full bg-emerald-700 text-white font-black py-3">
                سجّل دخول للمشاركة
              </Button>
            </Link>

            <Button
              onClick={onClose}
              className="w-full rounded-full bg-slate-200 text-slate-700 font-black py-3"
            >
              إغلاق
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function ChallengeDetailsModal({ open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-8 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-emerald-700">
            📌 تفاصيل تحدي 10 أيام خير
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-slate-700"
        >
          <p>
            خلال 10 أيام من رمضان، نهدف لتوزيع آلاف الوجبات على المحتاجين.
            تبرعك يساعدنا على الوصول للهدف بسرعة.
          </p>

          <ul className="list-disc pr-6 text-slate-600">
            <li>الهدف: 5000 وجبة</li>
            <li>عدد الأيام: 10</li>
            <li>الحالة: مفتوح</li>
            <li>الشهر: رمضان</li>
          </ul>

          <div className="flex gap-4 mt-6">
            <Link to="/donor/login" className="w-full">
              <Button className="w-full rounded-full bg-emerald-700 text-white font-black py-3">
                تبرع الآن
              </Button>
            </Link>

            <Button
              onClick={onClose}
              className="w-full rounded-full bg-slate-200 text-slate-700 font-black py-3"
            >
              إغلاق
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
