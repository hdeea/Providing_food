import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, CheckCircle, XCircle, Heart } from 'lucide-react';

const trackSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

type FormData = z.infer<typeof trackSchema>;

const TrackRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async () => {
    try {
      setIsSearching(true);
      setHasSearched(true);

      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("يجب تسجيل الدخول أولاً");
        return;
      }

      const response = await fetch(`/api/Beneficiary/my-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      setRequests(result);

    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "تمت الموافقة":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> تمت الموافقة
          </Badge>
        );

      case "مرفوض":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> مرفوض
          </Badge>
        );

      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> قيد الانتظار
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-emerald-800 mb-2">Providing Food</h1>
          <p className="text-emerald-700 text-lg">تتبع طلبات المساعدة الغذائية الخاصة بك</p>
        </div>

        {/* Search */}
        <Card className="mb-10 shadow-xl rounded-2xl border border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-emerald-800">
              تتبع طلباتك
            </CardTitle>
            <CardDescription className="text-center text-emerald-600">
              أدخل بريدك الإلكتروني لعرض جميع طلباتك وحالتها
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="rounded-xl border-emerald-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "جاري البحث..." : "بحث"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div>
            {requests.length === 0 ? (
              <Card className="rounded-2xl shadow-md border border-emerald-200">
                <CardContent className="text-center py-10">
                  <p className="text-emerald-700 text-lg">لا توجد طلبات مرتبطة بهذا الحساب</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                  طلباتك <span className="text-emerald-600">({requests.length})</span>
                </h2>

                {requests.map((request) => (
                  <Card
                    key={request.requestId}
                    className="rounded-2xl shadow-lg border border-emerald-200 bg-white"
                  >
                    <CardContent className="p-6">

                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-xl text-emerald-900">{request.fullName}</h3>
                          <p className="text-sm text-emerald-600">رقم الطلب: {request.requestId}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-emerald-800">

                        <div className="flex justify-between">
                          <span className="font-medium">عدد الأفراد:</span>
                          <span>{request.familySize} أشخاص</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-medium">الحالة الاجتماعية:</span>
                          <span>{request.maritalStatus}</span>
                        </div>

                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackRequestPage;
