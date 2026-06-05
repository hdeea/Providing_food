import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
import { Heart, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type FormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const loggedInUser = await login(data.email, data.password);

      if (loggedInUser) {
        if (loggedInUser.role === "admin") {
          navigate("/admin");
        } else if (loggedInUser.role === "restaurant") {
          navigate("/restaurant");
        } else {
          toast({
            title: "وصول غير مصرح",
            description: "حسابك لا يملك صلاحيات الدخول إلى لوحة التحكم",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "فشل تسجيل الدخول",
          description: "تحقق من البيانات وحاول مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "فشل تسجيل الدخول",
        description: error?.message || "الخادم غير متاح حاليًا. حاول لاحقًا.",
        variant: "destructive",
      });
      console.error("Login form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md" dir="rtl">
      <div className="rounded-[2rem] border border-white/20 bg-white/10 p-10 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 mb-4 border border-white/30">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Providing Food</h1>
          <p className="text-white/90 mt-2">لوحة تحكم الجمعية</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-semibold">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      {...field}
                      autoComplete="email"
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-semibold">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      autoComplete="current-password"
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full bg-white text-emerald-900 hover:bg-slate-100 py-3 text-base font-black shadow-xl shadow-black/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent"></span>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <LogIn className="h-5 w-5" />
                  تسجيل الدخول
                </span>
              )}
            </Button>

          </form>
        </Form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm">
         
         لأسباب أمنية، يمكن للمسؤولين المخوّلين فقط الوصول إلى هذه اللوحة
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
