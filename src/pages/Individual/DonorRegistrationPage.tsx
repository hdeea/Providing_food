import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Heart, User, Mail, Utensils, MapPin, Camera, Search } from 'lucide-react';
import { postDonationIndividual } from '@/api/postDonationIndividual';
import { DonationIndividualDto } from '@/types/individual';


// Validation Schema
const donorSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  userType: z.string().min(1, 'User type is required'),
  address: z.string().min(1, 'Address is required'),
  vegetarian: z.boolean(),
  email: z.string().email('Invalid email address'),
  description: z.string().min(1, 'Description is required'),
  foodImage: z.string().min(1, 'Food image is required'),
});

type FormData = z.infer<typeof donorSchema>;


const DonorRegistrationPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      foodName: '',
      userType: 'Individual',
      address: '',
      vegetarian: false,
      email: '',
      description: '',
      foodImage: '',
    },
  });

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue('foodImage', reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const payload: DonationIndividualDto = {
        foodName: data.foodName,
        userType: data.userType,
        description: data.description,
        image: data.foodImage,
        country: data.address,
        vegetarian: data.vegetarian,
        userEmail: data.email,
        status: 'Pending',
        requesId: 0,
        foodId: 0,
      };

      await postDonationIndividual(payload);

      form.reset();

      toast({
        title: "تم إرسال طلب التبرع بنجاح",
        description: "تم إرسال طلبك إلى الجمعية.",
      });

    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إرسال الطلب.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-full mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Food Donation</h1>
          <p className="text-slate-600 mt-1">Create Donation Request</p>
        </div>

        {/* Quick Action */}
        <div className="mb-8 text-center">
          <a
            href="/individual/track-donations"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
          >
            <Search className="w-4 h-4" />
            Track Your Requests
          </a>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl rounded-3xl border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-center font-bold text-slate-800">
              New Donation Request
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Food Name */}
                <FormField
                  control={form.control}
                  name="foodName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Utensils className="w-4 h-4 text-emerald-700" />
                        Food Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Rice with Chicken"
                          className="rounded-xl border-slate-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* User Type */}
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold">
                        <User className="w-4 h-4 text-emerald-700" />
                        User Type
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Individual"
                          className="rounded-xl border-slate-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, Area, Street"
                          className="rounded-xl border-slate-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vegetarian */}
                <FormField
                  control={form.control}
                  name="vegetarian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Is the food vegetarian?
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-6 mt-2">
                          <label className="flex items-center gap-2 text-slate-700">
                            <input
                              type="radio"
                              checked={field.value === true}
                              onChange={() => field.onChange(true)}
                              className="accent-emerald-700"
                            />
                            Yes
                          </label>

                          <label className="flex items-center gap-2 text-slate-700">
                            <input
                              type="radio"
                              checked={field.value === false}
                              onChange={() => field.onChange(false)}
                              className="accent-emerald-700"
                            />
                            No
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Utensils className="w-4 h-4 text-emerald-700" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Write details about the food..."
                          className="rounded-xl border-slate-300 focus:border-emerald-600"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Mail className="w-4 h-4 text-emerald-700" />
                        Email Address
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

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Food Image
                  </label>

                  <label
                    htmlFor="food-image"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <Camera className="w-10 h-10 text-slate-500 mb-3" />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Click to upload</span> food image
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, JPEG</p>

                    <input
                      id="food-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {form.watch("foodImage") && (
                    <img
                      src={form.watch("foodImage")}
                      alt="Preview"
                      className="mt-3 h-32 w-32 rounded-xl object-cover border shadow"
                    />
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-full mt-4"
                >
                  {isSubmitting ? "Sending..." : "Send Donation Request"}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            We will contact you within 24 hours after reviewing your request.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DonorRegistrationPage;
