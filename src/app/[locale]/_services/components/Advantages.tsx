"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Feature = {
  icon: string;
  titleKey: string;
  descKey: string;
};

const features: Feature[] = [
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

const RingIcon = ({ src, pos }: { src: string; pos: string }) => (
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

const Advantages = () => {
  const t = useTranslations("advantages");

  return (
    <section className="px-4 md:px-0">
      <div
        className="w-full px-4 md:px-8 py-10 lg:py-16 md:max-w-[95%] mx-auto rounded-3xl md:rounded-[48px] bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text column */}
          <div className="flex flex-col justify-center items-start gap-4">
            <h6 className="rounded-3xl shadow-sm px-4 py-2 bg-white text-[#301B69] font-medium text-sm flex items-center gap-2">
              <Image src="/icons/MagicWand.svg" alt="" width={20} height={20} aria-hidden="true" />
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
                      <Image src={f.icon} alt="" width={30} height={30} aria-hidden="true" />
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
              {/* Center logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none">
                <span className="text-4xl md:text-7xl font-bold" style={{ fontFamily: "inherit" }}>
                  <span className="text-[#301B69]">زواج</span>{" "}
                  <span className="text-[#E30BCD]">إن</span>
                </span>
              </div>

              {ringIcons.map((ri) => (
                <RingIcon key={ri.src} src={ri.src} pos={ri.pos} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;