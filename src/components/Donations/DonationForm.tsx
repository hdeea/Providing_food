import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RestaurantDonation } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createRestaurantDonation } from '@/api/donations/createRestaurantDonation';

interface DonationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (donation: RestaurantDonation) => void;
  restaurantId: string;
}

const donationSchema = z.object({
  quantity: z.coerce.number().min(1, 'الكمية مطلوبة ويجب أن تكون رقمًا'),
  dateDonated: z.string().min(1, 'تاريخ التبرع مطلوب'),
  restaurantName: z.string().min(1, 'اسم المطعم مطلوب'),
  deliveryLocation: z.string().min(1, 'موقع التسليم مطلوب'),
});

type FormData = z.infer<typeof donationSchema>;

const DonationForm: React.FC<DonationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  restaurantId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      quantity: 1,
      dateDonated: new Date().toISOString().slice(0, 10),
      restaurantName: '',
      deliveryLocation: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
  const payload: RestaurantDonation = {
  quantity: data.quantity,
  dateDonated: data.dateDonated.slice(0, 10),
  restaurantName: data.restaurantName.trim(),         // ✂️ قص الفراغات
  deliveryLocation: data.deliveryLocation.trim(),     // ✂️ كمان هون
};

console.log("📦 البيانات المرسلة:", payload);

      await createRestaurantDonation(payload);

      toast({
        title: "تم إرسال التبرع",
        description: "شكراً لمساهمتك ❤️",
      });

      form.reset();
      onSave?.(payload);
      onClose();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال التبرع. تحقق من الاتصال أو صحة البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>طلب تبرع</DialogTitle>
          <DialogDescription>
            يرجى تعبئة تفاصيل الطعام الذي ترغب بالتبرع به
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الكمية</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="عدد الوجبات"
                      type="number"
                      min={1}
                      {...field}
                      value={field.value.toString()}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المطعم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المطعم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateDonated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ التبرع</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موقع التسليم</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: شارع الثورة، دمشق" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button type="submit" className="button-blue" disabled={isSubmitting}>
                {isSubmitting ? "جارٍ الإرسال..." : "إرسال"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;
