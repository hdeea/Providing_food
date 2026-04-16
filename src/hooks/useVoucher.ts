import { useState } from "react";
import { createVoucherService } from "../services/voucherService";

export function useVoucher() {
  const [loading, setLoading] = useState(false);

  const createVoucher = async (data: any) => {
    setLoading(true);
    try {
      return await createVoucherService(data);
    } finally {
      setLoading(false);
    }
  };

  return { createVoucher, loading };
}
