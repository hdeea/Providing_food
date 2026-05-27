import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Search, Heart, Mail } from 'lucide-react';
import { DonationIndividualDto } from '../../types/individual';
import { getMyDonations } from '@/api/donations/getMyDonation';

const trackSchema = z.object({
  email: z.string().email('الرجاء إدخال بريد إلكتروني صحيح'),
});

type FormData = z.infer<typeof trackSchema>;

const TrackDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<DonationIndividualDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSearching(true);
      setHasSearched(true);

      const result = await getMyDonations(data.email);
      setDonations(result);

      toast({
        title: result.length === 0 ? "لا يوجد تبرعات" : "تم العثور على تبرعات",
        description:
          result.length === 0
            ? "لا يوجد طلبات تبرع مرتبطة بهذا البريد."
            : `تم العثور على ${result.length} طلب تبرع.`,
        variant: result.length === 0 ? "destructive" : "default",
      });

    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">مقبول</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-full mb-4 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">تتبّع طلبات التبرع</h1>
          <p className="text-slate-600">أدخل بريدك الإلكتروني لعرض جميع طلباتك</p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 rounded-3xl shadow-xl border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-center font-bold text-slate-800">
              البحث عن طلبات التبرع
            </CardTitle>
            <CardDescription className="text-center">
              أدخل البريد الإلكتروني المستخدم عند إرسال الطلب
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-semibold text-slate-700">
                        <Mail className="w-4 h-4 text-emerald-700" />
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="rounded-xl border-slate-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-full py-3"
                  disabled={isSearching}
                >
                  <Search className="w-4 h-4 ml-2" />
                  {isSearching ? "جاري البحث..." : "بحث"}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              طلبات التبرع {donations.length > 0 && `(${donations.length})`}
            </h2>

            {donations.length === 0 ? (
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">لا يوجد تبرعات</h3>
                  <p className="text-slate-600">
                    لم يتم العثور على أي طلبات تبرع مرتبطة بهذا البريد.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {donations.map((donation, index) => (
                  <Card
                    key={donation.id || `${donation.userEmail}-${donation.foodName}-${index}`}
                    className="rounded-2xl shadow-md border border-slate-200"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2 font-bold text-slate-900">
                          <Heart className="w-5 h-5 text-emerald-700" />
                          طلب رقم #{donation.id}
                        </CardTitle>
                        {getStatusBadge(donation.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-slate-700">
                      <p><span className="font-semibold">اسم الطعام:</span> {donation.foodName}</p>
                      <p><span className="font-semibold">الوصف:</span> {donation.description}</p>
                      <p><span className="font-semibold">البريد:</span> {donation.userEmail}</p>
                      <p><span className="font-semibold">البلد:</span> {donation.country}</p>
                      <p><span className="font-semibold">نباتي:</span> {donation.vegetarian ? "نعم" : "لا"}</p>

                      {donation.image && (
                        <img
                          src={donation.image}
                          alt="صورة التبرع"
                          className="w-full max-w-xs rounded-xl border shadow mt-2"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center text-slate-500 mt-10">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>أدخل بريدك الإلكتروني للبحث عن طلبات التبرع</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDonationsPage;
