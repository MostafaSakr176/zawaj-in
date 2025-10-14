"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Memoize icons array outside component for performance
const ICONS = [
  "/icons/hero-users-Icon.webp",
  "/icons/hero-chat-Icon.webp",
  "/icons/hero-smiley-Icon.webp",
  "/icons/hero-heart-Icon.webp",
];

const Hero = React.memo(() => {
  const t = useTranslations("hero");

  return (
    <section className="pt-40 md:pt-48 pb-20 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Content */}
          <div>
            <p
              className="text-xl md:text-3xl mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
              }}
            >
              {t("welcomeText")}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#301B69] mb-6 leading-normal">
              <span>{t("mainTitle")}</span>
              <br />
              <span>{t("subtitle")}</span>
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/auth/sign-in">
                <Button>
                  <ArrowRight size={16} className="rtl:inline-block ltr:hidden" />
                  <ArrowLeft size={16} className="rtl:hidden ltr:inline-block" />
                  {t("registerButton")}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary">{t("newRegisterButton")}</Button>
              </Link>
            </div>
          </div>
          {/* Image and Stats */}
          <div className="flex justify-end rtl:lg:pl-8 ltr:lg:pr-8">
            <div className="relative w-[90%] md:w-[70%] mx-auto md:mx-0">
              <Image
                src="/photos/hero-img.webp"
                alt={t("mainTitle")}
                width={320}
                height={400}
                className="w-full object-cover"
                priority // Only hero image should be priority for FCP
              />
              {/* Success Rate Card */}
              <div className="absolute -top-8 rtl:-left-4 ltr:-right-4 rtl:md:-left-8 ltr:md:-right-8 border-[0.84px] border-[#ECEFF2] bg-white rounded-xl md:rounded-3xl px-2 md:px-4 pt-2 shadow-lg z-10">
                <div className="text-center">
                  <div className="relative w-28 h-18 md:w-36 md:h-24 mx-auto">
                    <svg viewBox="0 0 100 50">
                      <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        stroke="#F3EFFE"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="113 126"
                      />
                    </svg>
                    <div className="w-full absolute top-5 md:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
                      <span className="text-md md:text-2xl font-semibold font-sans text-[#343B46]">
                        {t("successRate")}
                      </span>
                      <p className="text-xs md:text-sm text-gray-600 font-medium">
                        {t("successRateLabel")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Brain Icon */}
              <div
                className="absolute -top-4 rtl:-right-4 ltr:-left-4 md:-top-8 rtl:md:-right-8 ltr:md:-left-8 rounded-full p-3 md:p-4 shadow-lg z-10 border-3 border-white"
                style={{
                  background:
                    "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)",
                }}
              >
                <Image
                  src="/photos/vows.webp"
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-6 h-6 md:w-8 md:h-8"
                  loading="lazy"
                />
              </div>
              {/* Bottom Icons Card */}
              <div className="w-52 absolute -bottom-10 md:-bottom-6 rtl:-right-4 ltr:-left-4 rtl:md:-right-8 ltr:md:-left-8 bg-white rounded-xl md:rounded-2xl px-4 md:px-6 py-3 shadow-lg z-10">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex -space-x-2">
                    {ICONS.map((icon) => (
                      <div
                        key={icon}
                        className="rounded-full p-2 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)",
                        }}
                      >
                        <Image
                          src={icon}
                          alt="icon"
                          width={24}
                          height={24}
                          className="w-4 h-4 md:w-6 md:h-6"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-[#301B69]">
                    <p className="font-medium">{t("zodiacText")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;