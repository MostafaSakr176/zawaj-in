"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Memoize static data outside the component for performance
const features = [
  { icon: "/icons/phone-heart.svg", titleKey: "registerTitle", descKey: "registerDesc" },
  { icon: "/icons/wedding-rings.svg", titleKey: "stepTitle", descKey: "stepDesc" },
  { icon: "/icons/love-hate.svg", titleKey: "preferencesTitle", descKey: "preferencesDesc" },
  { icon: "/icons/checklist.svg", titleKey: "paymentTitle", descKey: "paymentDesc" },
];

const ringIcons = [
  { src: "/icons/advantages section/circle-shape/icon1.svg", pos: "left-1/2 -translate-x-1/2 -top-9 md:-top-14" },
  { src: "/icons/advantages section/circle-shape/icon2.svg", pos: "-right-[10%] top-1/5" },
  { src: "/icons/advantages section/circle-shape/icon3.svg", pos: "-right-[10%] bottom-1/5" },
  { src: "/icons/advantages section/circle-shape/icon4.svg", pos: "left-1/2 -translate-x-1/2 -bottom-9 md:-bottom-14" },
  { src: "/icons/advantages section/circle-shape/icon5.svg", pos: "-left-[10%] bottom-1/5" },
  { src: "/icons/advantages section/circle-shape/icon6.svg", pos: "-left-[10%] top-1/5" },
];

const RingIcon = React.memo(function RingIcon({ src, pos }: { src: string; pos: string }) {
  return (
    <div
      className={`absolute ${pos} bg-white rounded-full shadow-sm w-14 h-14 md:w-22 md:h-22 flex items-center justify-center`}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        width={42}
        height={42}
        className="w-6 h-6 md:w-10 md:h-10"
        loading="lazy"
      />
    </div>
  );
});

const Advantages = React.memo(function Advantages() {
  const t = useTranslations("advantages");
  const [showFirst, setShowFirst] = useState(true);

  // Use state instead of refs for toggling images, and avoid direct DOM manipulation
  useEffect(() => {
    const interval = setInterval(() => setShowFirst((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px] bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text column */}
        <div className="flex flex-col justify-center items-start gap-4">
          <h6 className="rounded-3xl shadow-sm px-4 py-2 bg-white text-[#301B69] font-medium text-sm flex items-center gap-2">
            <Image src="/icons/MagicWand.svg" alt="" width={20} height={20} aria-hidden="true" loading="lazy" />
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

        {/* Graphics column */}
        <div className="flex justify-center items-center relative min-h-[320px] md:min-h-[420px] mb-8 lg:mb-0">
          <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] aspect-square rounded-full border-[15px] md:border-[25px] border-white">
            {/* Center logo and toggling images */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none flex flex-col items-center">
              <Image
                src="/icons/advantages/trans1.svg"
                alt=""
                width={230}
                height={166}
                style={{ display: showFirst ? "block" : "none" }}
                loading="eager"
                priority
              />
              <Image
                src="/icons/advantages/trans2.svg"
                alt=""
                width={230}
                height={166}
                style={{ display: showFirst ? "none" : "block" }}
                loading="eager"
                priority
              />
              <Image src="/photos/logo-ar.svg" alt="" width={233} height={84} className="rtl:block ltr:hidden" loading="lazy" />
              <Image src="/photos/logo-en.svg" alt="" width={233} height={84} className="rtl:hidden ltr:block" loading="lazy" />
            </div>
            {ringIcons.map((ri) => (
              <RingIcon key={ri.src} src={ri.src} pos={ri.pos} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Advantages;