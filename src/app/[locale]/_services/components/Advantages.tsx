"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

// Memoize static data outside the component for performance
const features = [
  { icon: "/icons/phone-heart.webp", titleKey: "registerTitle", descKey: "registerDesc" },
  { icon: "/icons/wedding-rings.webp", titleKey: "stepTitle", descKey: "stepDesc" },
  { icon: "/icons/love-hate.webp", titleKey: "preferencesTitle", descKey: "preferencesDesc" },
  { icon: "/icons/checklist.webp", titleKey: "paymentTitle", descKey: "paymentDesc" },
];

const ArframeImages = [
  "/icons/advantages/frame-1.svg",
  "/icons/advantages/frame-2.svg",
  "/icons/advantages/frame-3.svg",
  "/icons/advantages/frame-4.svg",
  "/icons/advantages/frame-5.svg",
  "/icons/advantages/frame-6.svg",
  "/icons/advantages/frame-7.svg",
  "/icons/advantages/frame-8.svg",
  "/icons/advantages/frame-9.svg",
];

const EnframeImages = [
  "/icons/advantages/en-frame-1.svg",
  "/icons/advantages/en-frame-2.svg",
  "/icons/advantages/en-frame-3.svg",
  "/icons/advantages/en-frame-4.svg",
  "/icons/advantages/en-frame-5.svg",
  "/icons/advantages/en-frame-6.svg",
  "/icons/advantages/en-frame-7.svg",
  "/icons/advantages/en-frame-8.svg",
  "/icons/advantages/en-frame-9.svg",
];

const Advantages = React.memo(function Advantages() {
  const t = useTranslations("advantages");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const locale = useLocale();

  // Animation to show images one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex < (locale === "ar" ? ArframeImages : EnframeImages).length - 1) {
          return prevIndex + 1;
        } else {
          // Reset to start over or keep showing all images
          return 0; // Start over
          // return prevIndex; // Keep all images visible
        }
      });
    }, 800); // 1 second delay

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px] bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Text column */}
        <div className="flex flex-col justify-center items-start gap-4">
          <h6 className="rounded-3xl shadow-sm px-4 py-2 bg-white text-[#301B69] font-medium text-sm flex items-center gap-2">
            <Image src="/icons/MagicWand.webp" alt="" width={20} height={20} aria-hidden="true" loading="lazy" />
            {t("features")}
          </h6>

          <h2 className="text-3xl md:text-5xl font-bold text-[#301B69] leading-normal">
            {t("title")}
          </h2>

          <p className="text-lg font-medium text-[#301B69]">{t("subtitle")}</p>

          <div className="grid grid-cols-2 w-full">
            {features.map((f, idx) => {
              const isLeft = idx % 2 === 0;
              const withBottomBorder = idx < 2;
              return (
                <div
                  key={f.titleKey}
                  className={[
                    "flex flex-col items-start gap-4 py-4 md:py-8",
                    isLeft ? "pe-4 md:pe-8" : "ps-4 md:ps-8",
                    withBottomBorder ? "border-b border-[#301B6914]" : "",
                    isLeft ? "rtl:border-l ltr:border-r border-[#301B6914]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <Image src={f.icon} alt="" width={30} height={30} aria-hidden="true" loading="lazy" />
                    <p className="text-base md:text-2xl font-semibold text-[#301B69]">
                      {t(f.titleKey)}
                    </p>
                  </div>
                  <p className="text-[16px] font-semibold text-[#301B69C2]">
                    {t(f.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphics column with animated images */}
        <div className="flex justify-end items-center">
          <div className="relative w-full max-w-md aspect-[600/596]">
            {(locale === "ar" ? ArframeImages : EnframeImages).map((src, index) => (
              <Image
                key={index}
                src={src}
                alt=""
                width={230}
                height={166}
                className={`absolute inset-0 w-full h-full object-contain ease-in-out ${index === currentImageIndex
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : 'opacity-0 transform translate-y-2 scale-95'
                  }`}
                loading="eager"
                priority={index === 0}
                style={{
                  zIndex: index === currentImageIndex ? 10 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Advantages;