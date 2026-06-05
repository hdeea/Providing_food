import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar, DollarSign } from "lucide-react";

import {
  Heart,
  Users,
  Utensils,
  Gift,
  UserPlus,
  HandHeart,
  Store,
  Award,
  Shield,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChallengesInfoModal, ChallengeDetailsModal } from "../pages/Chellenge/challenges-modals";

export default function Index() {

  const [showChallengesModal, setShowChallengesModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
const [showChallenge, setShowChallenge] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">

      {/* HEADER */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-row-reverse items-center justify-between gap-6 px-6 py-4">

          {/* LOGO RIGHT */}
          <div className="flex flex-row-reverse items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-700 text-lg font-black text-white shadow-lg shadow-emerald-700/20">
              PF
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black tracking-tight">Providing Food</h1>
              <p className="text-xs font-semibold uppercase text-emerald-700">Food Distribution Platform</p>
            </div>
          </div>

{/* NAV LINKS */}
<div className="hidden lg:flex flex-row-reverse items-center gap-6">

  {/* زر أهدي سنداً */}
  <button
    onClick={() => {
      window.location.href = "/donor/login?return=/donate-bond";
    }}
    className="
      flex flex-row-reverse items-center gap-2
      px-4 py-2
      rounded-full
      bg-emerald-500/10
      text-emerald-700
      hover:bg-emerald-600 hover:text-white
      transition-all
      border border-emerald-500/20
      text-sm font-semibold
    "
  >
    <Gift size={16} />
    <span>أهدي سنداً</span>
  </button>

  {/* زر التبرع المالي */}
  <button
    onClick={() => {
      window.location.href = "/donor/login?return=/donor/donate-cash";
    }}
    className="
      flex flex-row-reverse items-center gap-2
      px-4 py-2
      rounded-full
      bg-emerald-500/10
      text-emerald-700
      hover:bg-emerald-600 hover:text-white
      transition-all
      border border-emerald-500/20
      text-sm font-semibold
    "
  >
    <DollarSign size={16} />
    <span>تبرع مالي</span>
  </button>





  {/* روابط الناف */}
  <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition">
    الرئيسية
  </Link>



  <a href="#process" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition">
    من نحن
  </a>
   <a href="#process" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition">
    خدماتنا
  </a>
   <a href="#process" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition">
    اتصل بنا
  </a>
 
</div>


          {/* LOGIN BUTTON LEFT */}
          <Link to="/login">
            <Button className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800">
              Admin Login
            </Button>
          </Link>

        </div>
      </motion.header>

      <main>

        
{/* 🌙 تحدي 10 أيام رمضان */}
{/* Premium Ramadan Hero */}
<section className="relative overflow-hidden rounded-[40px] bg-[#07150F] px-10 py-16 lg:px-16 lg:py-20 mb-16 border border-white/5">

  {/* Background Glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 blur-[140px]" />

  {/* subtle gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_45%)]" />

  <div
    className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-14"
    dir="rtl"
  >

    {/* Content */}
    <div className="max-w-2xl">

      {/* Tag */}
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl mb-8">

        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

        <span className="text-sm font-medium tracking-wide text-emerald-100/80">
برنامج رمضان الخيري
        </span>

      </div>

      {/* Heading */}
      <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">

        10 Days of Giving
        <span className="block text-emerald-300 mt-2">
          During Ramadan
        </span>

      </h1>

      {/* Description */}
      <p className="mt-7 text-lg leading-9 text-slate-300 max-w-xl">
-انضم إلى رحلة خيرية هادفة لمدة عشرة أيام.
<br />
-ادعم العائلات المحتاجة بمساهمات يومية طوال شهر رمضان المبارك.

      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-10">

   <Link to="/donor/donation-type">
  <Button
    className="
      h-14 px-8 rounded-2xl
      bg-emerald-500 hover:bg-emerald-400
      text-black font-bold text-base
      shadow-[0_10px_40px_rgba(16,185,129,0.25)]
      transition-all duration-300
    "
  >
    شارك بالخير
  </Button>
</Link>

        <Link to="/donor/ramadan">
          <Button
            className="
              h-14 px-8 rounded-2xl
              bg-white/[0.04]
              border border-white/10
              text-white
              hover:bg-white/[0.07]
              backdrop-blur-xl
              font-semibold
              transition-all duration-300
            "
          >
          تفاصيل اكثر 
          </Button>
        </Link>

      </div>
    </div>

    {/* Right Side Visual */}
    <div className="relative hidden lg:flex items-center justify-center">

      {/* outer glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-emerald-400/10 blur-[120px]" />

      {/* premium card */}
      <div className="relative rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

        <div className="flex items-center justify-between gap-10">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/60">
              Ramadan
            </p>

            <h3 className="text-4xl font-black text-white mt-3">
              Giving
            </h3>

            <p className="text-slate-400 mt-4 leading-7 max-w-[220px]">
 عشرة ايام من الخير تستهدف مئات العائلات المحتاجة في شهر رمضان المبارك.
            </p>
          </div>

          {/* subtle moon */}
          <div className="relative flex items-center justify-center">

            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.35)]" />

            <div className="absolute right-6 top-0 w-40 h-40 rounded-full bg-[#07150F]" />

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-slate-900 px-6 py-20 text-white">
          <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl"></div>

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 shadow-sm">
                <Heart className="h-5 w-5 text-rose-200" />
                Building Community Impact Together
              </span>

              <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl md:text-7xl">
                Connect Generosity with Those in Need
              </h1>

              <p className="max-w-2xl text-lg text-slate-100/90 sm:text-xl">
                A comprehensive digital platform connecting donors, restaurants, and stores with beneficiaries through transparency and simplicity.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/individual/donate">
                  <Button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-black text-emerald-800 shadow-xl shadow-black/10 transition hover:bg-slate-100">
                    Start Donating
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/beneficiary/register">
                  <Button className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white shadow-lg shadow-black/10 transition hover:bg-white/20">
                    Request Help
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent" />
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/10 p-5 text-sm text-slate-100 shadow-inner shadow-white/5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Latest Impact</p>
                    <p className="mt-2 text-lg font-black">68,932 Meals Distributed</p>
                  </div>
                  <Heart className="h-10 w-10 text-rose-200" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: Users, value: "12,547", label: "Beneficiaries" },
                    { icon: Utensils, value: "384", label: "Restaurants" },
                    { icon: Store, value: "156", label: "Stores" },
                    { icon: Gift, value: "68,932", label: "Meals" }
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-center text-slate-100 shadow-sm">
                      <item.icon className="mx-auto mb-3 h-10 w-10 text-emerald-300" />
                      <p className="text-3xl font-black">{item.value}</p>
                      <p className="text-sm text-slate-300">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Speed</p>
                    <p className="mt-3 text-lg font-black text-white">Real-time Processing</p>
                    <p className="mt-2 text-sm text-slate-300">Fast and accurate meal distribution.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Trust</p>
                    <p className="mt-3 text-lg font-black text-white">Verified Recipients</p>
                    <p className="mt-2 text-sm text-slate-300">Ensuring aid reaches those who deserve it.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900">Our Services</h2>
            <p className="mt-3 text-lg text-slate-600">A comprehensive platform for every participant in the food donation chain</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: HandHeart,
                title: "Individual Donations",
                desc: "Support families in need with ease and transparency.",
  action: "/donor/login?return=/individual/donate"              },
              {
                icon: UserPlus,
                title: "Request Help",
                desc: "Register to receive food assistance quickly.",
                action: "/beneficiary/register"
              },
              {
                icon: Store,
                title: "Store Donations",
                desc: "Share food baskets and essentials with the community.",
                action: "/store/login"
              },
              {
                icon: Utensils,
                title: "Partner Restaurants",
                desc: "Join as a restaurant partner to serve beneficiaries.",
                action: "/restaurant/login"
              },
              {
  icon: Shield,
  title: "Shelter Posts",
  desc: "Create posts to request meals from restaurants and donors.",
  action: "/shelter/login"
}

            ].map((item, index) => (
              <Card key={index} className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader className="space-y-6 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900">{item.title}</CardTitle>
                  <CardDescription className="text-slate-600">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Link to={item.action}>
                    <Button className="w-full rounded-full bg-emerald-700 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800">
                      Explore Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="process" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900">How It Works</h2>
              <p className="mt-3 text-lg text-slate-600">Clear steps from donation to delivery.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: HandHeart, step: "1", title: "Donate", desc: "Contribute financially or with food items." },
                { icon: Gift, step: "2", title: "Issue Voucher", desc: "We issue a digital food voucher." },
                { icon: Users, step: "3", title: "Distribute", desc: "Support reaches verified beneficiaries." },
                { icon: Check, step: "4", title: "Benefit", desc: "Beneficiaries receive meals from partners." }
              ].map((item, index) => (
                <div key={index} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-white text-2xl font-black">
                    {item.step}
                  </div>
                  <item.icon className="mx-auto mb-4 h-10 w-10 text-emerald-700" />
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                Trusted Platform for All
              </span>
              <h2 className="mt-6 text-4xl font-black text-slate-900 sm:text-5xl">Transparency & Ease at Our Core</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                We provide clear visibility at every step and simplify processes so everyone can participate without hassle.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  "Real-time reports for every donation",
                  "Continuous support for beneficiaries",
                  "Partnerships with trusted restaurants & stores",
                  "User-friendly interface for everyone"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-slate-600">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-emerald-700/5 p-10 shadow-xl">
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { label: "Partners", value: "540+" },
                  { label: "Distribution Channels", value: "80+" },
                  { label: "Satisfaction Rate", value: "98%" },
                  { label: "Daily Requests Processed", value: "450+" }
                ].map((metric, idx) => (
                  <div key={idx} className="rounded-3xl bg-white/90 p-6 text-center shadow-sm">
                    <p className="text-3xl font-black text-emerald-700">{metric.value}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-slate-900 px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-12 shadow-2xl shadow-slate-900/20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_0.85fr] lg:items-center">
              <div>
                <h2 className="text-4xl font-black sm:text-5xl">Start Making a Positive Impact Now</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100/85">
                  Join the fastest-growing food distribution platform, where donors and partners collaborate to turn every contribution into hope.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
<Link to="/donor/donate-cash">
                  <Button className="rounded-full bg-white px-8 py-4 text-base font-black text-emerald-900 shadow-xl shadow-black/20 hover:bg-slate-100">
                    Start Donating
                  </Button>
                </Link>
                <Link to="/beneficiary/register">
                  <Button className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white shadow-lg shadow-black/10 hover:bg-white/20">
                    Submit Request
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <ChallengesInfoModal
  open={showChallengesModal}
  onClose={() => setShowChallengesModal(false)}
/>

<ChallengeDetailsModal
  open={showDetailsModal}
  onClose={() => setShowDetailsModal(false)}
/>

      </main>

      <footer className="bg-slate-950 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-700 text-lg font-black text-white shadow-lg shadow-emerald-700/30">
                  PF
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Providing Food</h3>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Food Distribution Platform</p>
                </div>
              </div>
              <p className="max-w-xl leading-7 text-slate-400">
                A digital platform connecting donors, partners, and beneficiaries with clear steps and accurate information.
              </p>
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 transition hover:bg-emerald-700"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Quick Links</h4>
              <ul className="space-y-3 text-slate-400">
                {['About Us', 'Partners', 'FAQ', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center gap-3 text-sm transition hover:text-white">
                      <ChevronRight className="h-4 w-4 text-emerald-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2emAssembly control panel] text-emerald-300">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-emerald-300" />
                  <span>Stria, Damascus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 text-emerald-300" />
                  <span dir="ltr">+963 912 345 678</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 text-emerald-300" />
                  <span>info@providingfood.org</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            � 2026 Providing Food � Built with passion for community
          </div>
        </div>
      </footer>
    </div>
  );
}
