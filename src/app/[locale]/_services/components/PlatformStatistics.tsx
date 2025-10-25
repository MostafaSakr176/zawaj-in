"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import api from "@/lib/axiosClient";

const AVATARS = [
  { src: "/icons/boy-img.webp", alt: "@shadcn", fallback: "CN" },
  { src: "/photos/male-icon.png", alt: "@evilrabbit", fallback: "ER" },
  { src: "/icons/female-img.webp", alt: "@evilrabbit", fallback: "ER" },
  { src: "/icons/girl-img.webp", alt: "@leerob", fallback: "LR" },
];

type Stat = {
  icon: string | React.ReactNode;
  labelKey: string;
  value: number | string;
  alt: string;
};

const DEFAULT_STATS: Stat[] = [
  {
    icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.0625 15.6062C17.0625 15.6062 28.0012 12.9182 28.0012 7.54688" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38.9363 15.6062C38.9363 15.6062 28 12.9182 28 7.54688" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.7031 11.5897C17.7031 7.12133 22.3115 3.5 27.9978 3.5C33.6841 3.5 38.2925 7.12133 38.2925 11.5897" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.7031 11.5897C17.7031 7.12133 22.3115 3.5 27.9978 3.5C33.6841 3.5 38.2925 7.12133 38.2925 11.5897" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M41.5331 33.5287C41.6862 33.4936 41.8426 33.4748 41.9997 33.4727C42.7753 33.5416 43.4926 33.9133 43.9961 34.5072C44.4996 35.1012 44.749 35.8696 44.6901 36.646C44.7483 37.422 44.4987 38.1898 43.9952 38.7832C43.4918 39.3767 42.7749 39.748 41.9997 39.817C41.4953 39.8142 41.0049 39.6507 40.5997 39.3503C38.6117 45.8603 32.1274 52.417 27.9997 52.417C23.8721 52.417 17.3971 45.8557 15.4114 39.3503C15.0058 39.65 14.5157 39.8134 14.0114 39.817C13.2362 39.748 12.5194 39.3767 12.0159 38.7832C11.5124 38.1898 11.2628 37.422 11.3211 36.646C11.262 35.8714 11.5098 35.1046 12.0108 34.511C12.5119 33.9174 13.2262 33.5445 13.9997 33.4727C14.1568 33.4748 14.3133 33.4936 14.4664 33.5287" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.7031 43.5859C24.1841 44.2718 24.8297 44.8258 25.5808 45.1968C26.3318 45.5679 27.1641 45.7441 28.0011 45.7093C28.8381 45.7441 29.6704 45.5679 30.4215 45.1968C31.1725 44.8258 31.8182 44.2718 32.2991 43.5859" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.611 30.4524C44.7246 30.2409 44.8296 30.0215 44.926 29.7944C45.295 28.9663 45.4903 28.0713 45.5 27.1648C45.5 21.3571 37.6647 16.6484 28 16.6484C18.3353 16.6484 10.5 21.3571 10.5 27.1648C10.5097 28.0713 10.705 28.9663 11.074 29.7944" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5898 43.2578C11.8492 44.8445 11.1624 46.0773 11.5295 46.9561C11.9098 47.8661 13.2095 47.8895 13.5898 48.8041C13.9702 49.7188 13.2702 50.9041 11.5295 52.5001" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42.4131 43.2578C44.1538 44.8445 44.8406 46.0773 44.4735 46.9561C44.0931 47.8661 42.7935 47.8895 42.4131 48.8041C42.0328 49.7188 42.7328 50.9041 44.4735 52.5001" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.6084 30.4517C42.5722 30.6493 40.5072 30.7488 38.4134 30.7504C20.3301 30.7504 19.1984 23.1367 19.1984 23.1367C19.1984 23.1367 19.5788 29.1824 15.3438 29.1824" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.1641 33.832V36.1654" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M33.8359 33.832V36.1654" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
    </svg>, alt: "male users", labelKey: "registered_males", value: 0
  },
  {
    icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.9688 36.6949C26.4835 37.2985 28.1497 37.4106 29.7317 37.0154C31.3137 36.6201 32.7313 35.7374 33.7841 34.4922" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33.3034 44.8242L27.9997 46.9242L22.6961 44.8242C21.4034 44.8242 21.4034 52.5009 22.6961 52.5009L27.9997 50.4009L33.3034 52.5009C34.5961 52.5009 34.5961 44.8242 33.3034 44.8242Z" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.2889 19.0036C39.7185 20.2653 34.8821 20.1884 30.3542 18.7821C25.8263 17.3758 21.7973 14.6992 18.7459 11.0703C18.7459 11.0703 19.8355 18.1986 15.5469 18.81" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45.1243 18.459C43.8176 8.16667 36.6473 3.5 27.9976 3.5C19.2709 3.5 12.0493 8.24833 10.8359 18.7413" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35.8008 41.9698C39.323 38.9641 41.8123 34.9281 42.9174 30.4315C43.3837 30.8208 43.9691 31.039 44.5764 31.0498C45.5403 30.9094 46.4118 30.3998 47.007 29.6287C47.6022 28.8577 47.8744 27.8855 47.7661 26.9175C47.8742 25.9481 47.6007 24.9747 47.0036 24.2034C46.4065 23.4321 45.5327 22.9234 44.5671 22.7852C44.3799 22.7881 44.1935 22.8124 44.0118 22.8575" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9777 22.8668C11.7993 22.8192 11.6162 22.7918 11.4317 22.7852C10.4678 22.9256 9.59629 23.4352 9.00113 24.2062C8.40597 24.9773 8.13377 25.9495 8.24202 26.9175C8.13377 27.8855 8.40597 28.8577 9.00113 29.6287C9.59629 30.3998 10.4678 30.9094 11.4317 31.0498C12.0395 31.0393 12.6252 30.8202 13.0907 30.4292C14.2059 34.9868 16.7485 39.0688 20.3474 42.0795" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.1641 24.5V26.8333" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M33.8359 24.5V26.8333" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
    </svg>
    , alt: "female users", labelKey: "registered_females", value: 0
  },
  {
    icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.2891 42.2109C30.0881 42.2109 34.7891 37.5099 34.7891 31.7109C34.7891 25.9119 30.0881 21.2109 24.2891 21.2109C18.4901 21.2109 13.7891 25.9119 13.7891 31.7109C13.7891 37.5099 18.4901 42.2109 24.2891 42.2109Z" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.7109 24.2911L39.1309 16.8711L40.3734 25.5336" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M39.1273 16.8714L30.4648 15.6289" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    , alt: "active males today", labelKey: "active_males", value: 0
  },
  {
    icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31.707 34.7891C37.506 34.7891 42.207 30.0881 42.207 24.2891C42.207 18.4901 37.506 13.7891 31.707 13.7891C25.908 13.7891 21.207 18.4901 21.207 24.2891C21.207 30.0881 25.908 34.7891 31.707 34.7891Z" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.2872 31.7109L16.8672 39.1309" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.045 40.3731L15.625 32.9531" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    , alt: "active females today", labelKey: "active_females", value: 0
  },
];

const StatCard = React.memo(function StatCard({ icon, labelKey, value, alt }: Stat) {
  const t = useTranslations("stats");
  return (
    <div
      className="flex flex-col items-center gap-2 md:gap-6 p-3 md:p-6 rounded-[12px] md:rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]"
      role="listitem"
    >
      {icon}
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
            {
              icon:
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.9688 36.6949C26.4835 37.2985 28.1497 37.4106 29.7317 37.0154C31.3137 36.6201 32.7313 35.7374 33.7841 34.4922" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M33.3034 44.8242L27.9997 46.9242L22.6961 44.8242C21.4034 44.8242 21.4034 52.5009 22.6961 52.5009L27.9997 50.4009L33.3034 52.5009C34.5961 52.5009 34.5961 44.8242 33.3034 44.8242Z" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M44.2889 19.0036C39.7185 20.2653 34.8821 20.1884 30.3542 18.7821C25.8263 17.3758 21.7973 14.6992 18.7459 11.0703C18.7459 11.0703 19.8355 18.1986 15.5469 18.81" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M45.1243 18.459C43.8176 8.16667 36.6473 3.5 27.9976 3.5C19.2709 3.5 12.0493 8.24833 10.8359 18.7413" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M35.8008 41.9698C39.323 38.9641 41.8123 34.9281 42.9174 30.4315C43.3837 30.8208 43.9691 31.039 44.5764 31.0498C45.5403 30.9094 46.4118 30.3998 47.007 29.6287C47.6022 28.8577 47.8744 27.8855 47.7661 26.9175C47.8742 25.9481 47.6007 24.9747 47.0036 24.2034C46.4065 23.4321 45.5327 22.9234 44.5671 22.7852C44.3799 22.7881 44.1935 22.8124 44.0118 22.8575" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.9777 22.8668C11.7993 22.8192 11.6162 22.7918 11.4317 22.7852C10.4678 22.9256 9.59629 23.4352 9.00113 24.2062C8.40597 24.9773 8.13377 25.9495 8.24202 26.9175C8.13377 27.8855 8.40597 28.8577 9.00113 29.6287C9.59629 30.3998 10.4678 30.9094 11.4317 31.0498C12.0395 31.0393 12.6252 30.8202 13.0907 30.4292C14.2059 34.9868 16.7485 39.0688 20.3474 42.0795" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22.1641 24.5V26.8333" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                  <path d="M33.8359 24.5V26.8333" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                </svg>
              , alt: "male users", labelKey: "registered_males", value: data.totalMaleUsers
            },
            {
              icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.0625 15.6062C17.0625 15.6062 28.0012 12.9182 28.0012 7.54688" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M38.9363 15.6062C38.9363 15.6062 28 12.9182 28 7.54688" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.7031 11.5897C17.7031 7.12133 22.3115 3.5 27.9978 3.5C33.6841 3.5 38.2925 7.12133 38.2925 11.5897" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.7031 11.5897C17.7031 7.12133 22.3115 3.5 27.9978 3.5C33.6841 3.5 38.2925 7.12133 38.2925 11.5897" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M41.5331 33.5287C41.6862 33.4936 41.8426 33.4748 41.9997 33.4727C42.7753 33.5416 43.4926 33.9133 43.9961 34.5072C44.4996 35.1012 44.749 35.8696 44.6901 36.646C44.7483 37.422 44.4987 38.1898 43.9952 38.7832C43.4918 39.3767 42.7749 39.748 41.9997 39.817C41.4953 39.8142 41.0049 39.6507 40.5997 39.3503C38.6117 45.8603 32.1274 52.417 27.9997 52.417C23.8721 52.417 17.3971 45.8557 15.4114 39.3503C15.0058 39.65 14.5157 39.8134 14.0114 39.817C13.2362 39.748 12.5194 39.3767 12.0159 38.7832C11.5124 38.1898 11.2628 37.422 11.3211 36.646C11.262 35.8714 11.5098 35.1046 12.0108 34.511C12.5119 33.9174 13.2262 33.5445 13.9997 33.4727C14.1568 33.4748 14.3133 33.4936 14.4664 33.5287" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.7031 43.5859C24.1841 44.2718 24.8297 44.8258 25.5808 45.1968C26.3318 45.5679 27.1641 45.7441 28.0011 45.7093C28.8381 45.7441 29.6704 45.5679 30.4215 45.1968C31.1725 44.8258 31.8182 44.2718 32.2991 43.5859" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M44.611 30.4524C44.7246 30.2409 44.8296 30.0215 44.926 29.7944C45.295 28.9663 45.4903 28.0713 45.5 27.1648C45.5 21.3571 37.6647 16.6484 28 16.6484C18.3353 16.6484 10.5 21.3571 10.5 27.1648C10.5097 28.0713 10.705 28.9663 11.074 29.7944" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5898 43.2578C11.8492 44.8445 11.1624 46.0773 11.5295 46.9561C11.9098 47.8661 13.2095 47.8895 13.5898 48.8041C13.9702 49.7188 13.2702 50.9041 11.5295 52.5001" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42.4131 43.2578C44.1538 44.8445 44.8406 46.0773 44.4735 46.9561C44.0931 47.8661 42.7935 47.8895 42.4131 48.8041C42.0328 49.7188 42.7328 50.9041 44.4735 52.5001" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M44.6084 30.4517C42.5722 30.6493 40.5072 30.7488 38.4134 30.7504C20.3301 30.7504 19.1984 23.1367 19.1984 23.1367C19.1984 23.1367 19.5788 29.1824 15.3438 29.1824" stroke="#301B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22.1641 33.832V36.1654" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M33.8359 33.832V36.1654" stroke="#301B69" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
              </svg>
              , alt: "female users", labelKey: "registered_females", value: data.totalFemaleUsers
            },
            {
              icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.2891 42.2109C30.0881 42.2109 34.7891 37.5099 34.7891 31.7109C34.7891 25.9119 30.0881 21.2109 24.2891 21.2109C18.4901 21.2109 13.7891 25.9119 13.7891 31.7109C13.7891 37.5099 18.4901 42.2109 24.2891 42.2109Z" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M31.7109 24.2911L39.1309 16.8711L40.3734 25.5336" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M39.1273 16.8714L30.4648 15.6289" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              , alt: "active males today", labelKey: "active_males", value: data.onlineMaleUsersToday
            },
            {
              icon: <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.707 34.7891C37.506 34.7891 42.207 30.0881 42.207 24.2891C42.207 18.4901 37.506 13.7891 31.707 13.7891C25.908 13.7891 21.207 18.4901 21.207 24.2891C21.207 30.0881 25.908 34.7891 31.707 34.7891Z" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24.2872 31.7109L16.8672 39.1309" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.045 40.3731L15.625 32.9531" stroke="#301B69" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              , alt: "active females today", labelKey: "active_females", value: data.onlineFemaleUsersToday
            },
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