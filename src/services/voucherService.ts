import { generateVoucher } from "../api/Store/generateVoucher";

export async function createVoucherService(data: any) {
  return await generateVoucher(data);
}
