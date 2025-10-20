"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import axios from "axios";
import api from "@/lib/axiosClient";

const AVATARS = [
  { src: "/icons/boy-img.webp", alt: "@shadcn", fallback: "CN" },
  { src: "/photos/male-icon.png", alt: "@evilrabbit", fallback: "ER" },
  { src: "/icons/female-img.webp", alt: "@evilrabbit", fallback: "ER" },
  { src: "/icons/girl-img.webp", alt: "@leerob", fallback: "LR" },
];

type Stat = {
  icon: string;
  labelKey: string;
  value: number | string;
  alt: string;
};

const DEFAULT_STATS: Stat[] = [
  { icon: "/icons/male.webp", alt: "male users", labelKey: "registered_males", value: 0 },
  { icon: "/icons/female-icon.png", alt: "female users", labelKey: "registered_females", value: 0 },
  { icon: "/icons/male-o.webp", alt: "active males today", labelKey: "active_males", value: 0 },
  { icon: "/icons/female-o.webp", alt: "active females today", labelKey: "active_females", value: 0 },
];

const StatCard = React.memo(function StatCard({ icon, labelKey, value, alt }: Stat) {
  const t = useTranslations("stats");
  return (
    <div
      className="flex flex-col items-center gap-2 md:gap-6 p-3 md:p-6 rounded-[12px] md:rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]"
      role="listitem"
    >
      <Image src={icon} alt={alt} width={56} height={56} className="w-7 h-7 md:w-14 md:h-14" loading="lazy" />
      <p className="text-xs md:text-lg font-semibold text-[#301B69]">{t(labelKey)}</p>
      <p className="text-[#301B69] font-bold text-2xl md:text-5xl">{value}</p>
    </div>
  );
});

const PlatformStatistics = React.memo(function PlatformStatistics() {
  const t = useTranslations("stats");
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    api.get("/users/statistics")
      .then(res => {
        const data = res.data?.data;
        if (data) {
          setStats([
            { icon: "/icons/male.webp", alt: "male users", labelKey: "registered_males", value: data.totalMaleUsers },
            { icon: "/icons/female-icon.png", alt: "female users", labelKey: "registered_females", value: data.totalFemaleUsers },
            { icon: "/icons/male-o.webp", alt: "active males today", labelKey: "active_males", value: data.onlineMaleUsersToday },
            { icon: "/icons/female-o.webp", alt: "active females today", labelKey: "active_females", value: data.onlineFemaleUsersToday },
          ]);
        }
      })
      .catch(() => {
        setStats(DEFAULT_STATS);
      });
  }, []);

  const avatarList = useMemo(
    () =>
      AVATARS.map(({ src, alt, fallback }) => (
        <Avatar className="w-6 h-6" key={src}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )),
    []
  );

  const statCards = useMemo(
    () => stats.map((stat) => <StatCard key={stat.labelKey} {...stat} />),
    [stats, t]
  );

  return (
    <section className="max-w-7xl mx-auto pt-16 pb-20 px-4">
      {/* Section badge with avatars */}
      <div className="flex items-center mx-auto w-fit">
        <Image
          src="/photos/heading-smoth-shape-right.webp"
          alt="right shape"
          width={40}
          height={25}
          className="-ml-[5px] relative z-10 ltr:hidden rtl:inline-block"
          loading="lazy"
        />
        <Image
          src="/photos/heading-smoth-shape-left.webp"
          alt="left shape"
          width={40}
          height={25}
          className="-mr-[5px] relative z-10 rtl:hidden ltr:inline-block"
          loading="lazy"
        />
        <div
          className="w-fit border border-white shadow-md rounded-3xl lg:rounded-4xl px-4 md:px-6 py-2 flex items-center gap-2 md:gap-4 bg-[linear-gradient(229.14deg,#F2EFFF_-7.04%,#FFF1FE_121.07%)]"
        >
          <span className="text-lg md:text-xl text-black font-semibold">
            {t("title")}
          </span>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            {avatarList}
          </div>
        </div>
        <Image
          src="/photos/heading-smoth-shape-right.webp"
          alt="right shape"
          width={40}
          height={25}
          className="-ml-[5px] relative z-10 rtl:hidden ltr:inline-block"
          loading="lazy"
        />
        <Image
          src="/photos/heading-smoth-shape-left.webp"
          alt="left shape"
          width={40}
          height={25}
          className="-mr-[5px] relative z-10 ltr:hidden rtl:inline-block"
          loading="lazy"
        />
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-10"
        role="list"
        aria-label={t("title")}
      >
        {statCards}
      </div>
    </section>
  );
});

PlatformStatistics.displayName = "PlatformStatistics";
export default PlatformStatistics;