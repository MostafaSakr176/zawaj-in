"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SaudiRiyal } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Memoize static data outside the component for performance
type PlanKey = "silver" | "gold" | "match";
type Plan = {
  key: PlanKey;
  highlight?: boolean;
  bg: string;
  border: string;
  button: string;
  badge?: boolean;
};

const plans: Plan[] = [
  { key: "silver", bg: "bg-white", border: "border border-[#F3EFFE]", button: "bg-white text-[#301B69]" },
  { key: "gold", bg: "bg-white", border: "border-2 border-[#8b5cf6]", button: "bg-[#301B69] text-white shadow-lg", badge: true, highlight: true },
  { key: "match", bg: "bg-white", border: "border border-[#F3EFFE]", button: "bg-white text-[#301B69]" }
];

const planFeatures: Record<string, string[]> = {
  silver: ["silver.features1", "silver.features2"],
  gold: [
    "gold.features1",
    "gold.features2",
    "gold.features3",
    "gold.features4"
  ],
  match: ["match.features1"]
};

const Badge = React.memo(({ t }: { t: (key: string) => string }) => (
  <span
    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 md:-translate-y-0 md:top-6 rtl:md:left-4 rtl:md:right-auto ltr:md:right-4 ltr:md:left-auto text-[#301B69] text-[10px] font-semibold px-3 py-1 rounded-full border-2 border-white flex items-center gap-1"
    style={{ background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)" }}
  >
    <Image src="/icons/plans/star.webp" alt={t("mostPopular")} width={12} height={12} loading="lazy" />
    {t("mostPopular")}
    <Image src="/icons/plans/star.webp" alt="" width={12} height={12} loading="lazy" />
  </span>
));

const PlanCard = React.memo(function PlanCard({ plan, t }: { plan: Plan; t: (key: string) => string }) {
  const glass = plan.key !== "gold" ? "bg-white/60 backdrop-blur-md" : "";
  return (
    <div className={`my-4 relative ${plan.bg} border-x border-[#301B6929] rounded-[24px] py-8 px-6 flex flex-col justify-between shadow-sm ${glass}`}>
      {plan.badge && <Badge t={t} />}
      <div className="mb-20">
        <h3 className="text-3xl font-bold text-[#301B69] text-center md:text-start mb-2">
          {t(`${plan.key}.title`)}
        </h3>
        <div className="text-lg font-medium text-[#301B69] text-center md:text-start mb-2">
          {t(`${plan.key}.duration`)}
        </div>
        <div className="text-3xl font-bold text-[#301B69] mb-4 flex items-center justify-center md:justify-start gap-1">
          {t(`${plan.key}.price`)} <SaudiRiyal size={30} />
        </div>
        <hr className="my-4 border-[#F3EFFE]" />
        <div className="text-[#301B69] text-right mb-4 font-semibold">
          {t(`${plan.key}.featuresTitle`)}
        </div>
        <ul className="space-y-2">
          {planFeatures[plan.key].map((featureKey, i) => (
            <li key={i} className="flex items-start gap-2 text-[#301B69] text-[16px]">
              <Image src="/icons/plans/Check Circle.webp" alt="Check icon" width={20} height={20} loading="lazy" />
              <span>{t(featureKey)}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button variant={plan.key === "gold" ? "default" : "secondary"}>
        {t(`${plan.key}.button`)}
      </Button>
    </div>
  );
});

const Subscriptions = React.memo(function Subscriptions() {
  const t = useTranslations("subscriptions");

  // Memoize plan cards for performance
  const planCards = useMemo(
    () => plans.map((plan) => <PlanCard key={plan.key} plan={plan} t={t} />),
    [t]
  );

  return (
    <section
      id="subscriptions"
      className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px]"
      style={{
        background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"
      }}
    >
      <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center">
        {t("title")}
      </h2>
      <p className="text-base md:text-lg font-medium text-[#301B69] text-center mb-10">
        {t("subtitle")}
      </p>
      {/* Mobile Swiper */}
      <div className="flex md:hidden subscriptions-swiper">
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 4, spaceBetween: 16 },
          }}
          spaceBetween={16}
          loop={true}
          speed={2000}
          centeredSlides={false}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {plans.map((plan) => (
            <SwiperSlide key={plan.key} className="h-full">
              <PlanCard plan={plan} t={t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
        {planCards}
      </div>
    </section>
  );
});

export default Subscriptions;