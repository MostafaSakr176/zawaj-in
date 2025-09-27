"use client"
import { Button } from '@/components/ui/button';
import { SaudiRiyal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

const plans = [
  {
    key: "silver",
    highlight: false,
    bg: "bg-white",
    border: "border border-[#F3EFFE]",
    button: "bg-white text-[#301B69]",
  },
  {
    key: "gold",
    highlight: true,
    bg: "bg-white",
    border: "border-2 border-[#8b5cf6]",
    button: "bg-[#301B69] text-white shadow-lg",
    badge: true,
  },
  {
    key: "match",
    highlight: false,
    bg: "bg-white",
    border: "border border-[#F3EFFE]",
    button: "bg-white text-[#301B69]",
  },
];

const Subscriptions = () => {
  const t = useTranslations("subscriptions");

  return (
    <div
      className="w-full px-4 lg:py-16 md:max-w-[95%] mx-auto rounded-[48px] mt-20"
      style={{
        background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"
      }}
    >
      <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center">
        {t("title")}
      </h2>
      <p className="text-lg font-medium text-[#301B69] text-center mb-10">
        {t("subtitle")}
      </p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={plan.key}
            className={`h-full relative ${plan.bg} border-x border-[#301B6929] rounded-[24px] py-8 px-6 flex flex-col justify-between shadow-sm ${plan.key !== "gold" ? "bg-white/60 backdrop-blur-md" : ""}`}
          >
            {/* Badge */}
            {plan.badge && (
              <span className="absolute top-6 left-4 text-[#301B69] text-[10px] font-semibold px-3 py-1 rounded-full border-2 border-white flex items-center gap-1"
              style={{ background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)" }}>
                <Image src="/icons/plans/star.svg" alt="Most Popular" width={12} height={12} />
                {t(`${plan.key}.mostPopular`)}
                <Image src="/icons/plans/star.svg" alt="Most Popular" width={12} height={12} />
              </span>
            )}
            {/* Title & Duration */}
            <div className='mb-20'>
              <h3 className="text-3xl font-bold text-[#301B69] mb-2">
                {t(`${plan.key}.title`)}
              </h3>
              <div className="text-lg font-medium text-[#301B69] mb-2">
                {t(`${plan.key}.duration`)}
              </div>
              <div className="text-3xl font-bold text-[#301B69] mb-4 flex items-center gap-1">
                {t(`${plan.key}.price`)} <SaudiRiyal size={30} />
              </div>
              <hr className="my-4 border-[#F3EFFE]" />
              <div className="text-[#301B69] text-right mb-4 font-semibold">
                {t(`${plan.key}.featuresTitle`)}
              </div>
              <ul className="space-y-2">
                {plan.key === "silver" && [
                  "تواصل بلا حدود مع جميع الأعضاء المتاحة.",
                  "شعار مخصص يظهر في ملفك الشخصي."
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#301B69] text-[16px]">
                    <Image src="/icons/plans/Check Circle.svg" alt="Check icon" width={20} height={20} />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.key === "gold" && [
                  "استلام إشعارات غير محدود.",
                  "احصل على شعار مخصص يظهر ملفك عن الآخرين.",
                  "استخدم خاصية الدخول السريع (حماية خصوصيتك).",
                  "تواصل مع الأعضاء في أي وقت ومن أي مكان."
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#301B69] text-[16px]">
                    <Image src="/icons/plans/Check Circle.svg" alt="Check icon" width={20} height={20} />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.key === "match" && [
                  "في حال تم التوافق مع أحد الأعضاء وتم عقد النكاح، يتوجب على أحدكم سداد المبلغ أو دفعه في دفعتين."
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#301B69] text-[16px]">
                    <Image src="/icons/plans/Check Circle.svg" alt="Check icon" width={20} height={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Button */}
            <Button variant={plan.key === "gold" ? "default" : "secondary"} >
              {t(`${plan.key}.button`)}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;