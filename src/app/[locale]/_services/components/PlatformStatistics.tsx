"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import React from "react";

type Stat = {
  icon: string;
  labelKey: string;
  value: number | string;
  alt: string;
};

const PlatformStatistics = () => {
  const t = useTranslations("stats");

  const stats: Stat[] = [
    { icon: "/icons/male.svg", alt: "male users", labelKey: "registered_males", value: 300 },
    { icon: "/icons/female-icon.svg", alt: "female users", labelKey: "registered_females", value: 300 },
    { icon: "/icons/male-o.svg", alt: "active males today", labelKey: "active_males", value: 100 },
    { icon: "/icons/female-o.svg", alt: "active females today", labelKey: "active_females", value: 200 },
  ];

  const StatCard = ({ icon, labelKey, value, alt }: Stat) => (
    <div
      className="flex flex-col items-center gap-6 p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]"
      role="listitem"
    >
      <Image src={icon} alt={alt} width={56} height={56} />
      <p className="text-lg font-semibold text-[#301B69]">{t(labelKey)}</p>
      <p className="text-[#301B69] font-bold text-5xl">{value}</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto pt-16 pb-20 px-4">
      {/* Section badge with avatars */}
      <div className="flex items-center mx-auto w-fit">
        <Image
          src="/photos/heading-smoth-shape-right.svg"
          alt="right shape"
          width={40}
          height={25}
          className="-ml-[5px] relative z-10 ltr:hidden rtl:inline-block"
        />
        <Image
          src="/photos/heading-smoth-shape-left.svg"
          alt="left shape"
          width={40}
          height={25}
          className="-mr-[5px] relative z-10 rtl:hidden ltr:inline-block"
        />
        <div
          className="w-fit border border-white shadow-md rounded-3xl lg:rounded-4xl px-4 md:px-6 py-2 flex items-center gap-2 md:gap-4 bg-[linear-gradient(229.14deg,#F2EFFF_-7.04%,#FFF1FE_121.07%)]"
        >
          <span className="text-lg md:text-xl text-black font-semibold">
            {t("title")}
          </span>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/icons/boy-img.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6">
              <AvatarImage src="/photos/male-icon.svg" alt="@evilrabbit" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6">
              <AvatarImage src="/icons/female-img.png" alt="@evilrabbit" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6">
              <AvatarImage src="/icons/girl-img.png" alt="@leerob" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>


          </div>
        </div>
        <Image
          src="/photos/heading-smoth-shape-right.svg"
          alt="right shape"
          width={40}
          height={25}
          className="-ml-[5px] relative z-10 rtl:hidden ltr:inline-block"
        />
        <Image
          src="/photos/heading-smoth-shape-left.svg"
          alt="left shape"
          width={40}
          height={25}
          className="-mr-[5px] relative z-10 ltr:hidden rtl:inline-block"
        />
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-10"
        role="list"
        aria-label={t("title")}
      >
        {stats.map((stat) => (
          <StatCard key={stat.labelKey} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default PlatformStatistics;