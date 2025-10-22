"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookUser, ChevronDown, Contact, FileText, Headset, Heart, House, Menu, MessageCircle, NotebookText, Package, Podcast, Power, RefreshCcw, Siren, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const t = useTranslations("navbar");
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [navKey, setNavKey] = useState(0);
  const [hash, setHash] = useState<string>("");

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1];

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    // Set initial hash
    updateHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateHash);

    // Listen for popstate (back/forward browser buttons)
    window.addEventListener("popstate", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  // Handle hash link clicks
  const handleHashClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.substring(1); // Remove the leading "/"

      // Check if we're already on the home page
      const isOnHomePage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

      if (isOnHomePage) {
        // We're already on home page, just update hash and scroll
        window.history.pushState(null, "", `${pathname}${hash}`);
        setHash(hash);

        // Scroll to element if it exists
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // We're on a different page, navigate to home page with hash
        router.push(`/${currentLocale}${hash}`);
      }
    }
    setNavKey(navKey + 1);
  };

  // Handle main page click - removes hash
  const handleMainPageClick = (href: string) => {
    if (href === "/") {
      const isOnHomePage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

      if (isOnHomePage && hash) {
        // We're on home page with a hash, remove the hash
        window.history.pushState(null, "", `/${currentLocale}`);
        setHash("");
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!isOnHomePage) {
        // We're on a different page, navigate to home page
        router.push(`/${currentLocale}`);
      }
    }
    setNavKey(navKey + 1);
  };

  // Navigation links for guests and authenticated users
  const guestLinks = [
    { href: "/", label: t('mainPage'), icon: <House strokeWidth={1.75} size={24} />, bold: true },
    { href: "/#advantages", label: t('advantages'), icon: <BookUser strokeWidth={1.25} size={24} /> },
    { href: "/#subscriptions", label: t('subscriptions'), icon: <Podcast strokeWidth={1.25} size={24} /> },
    { href: "/#userOpinion", label: t('userOpinion'), icon: <NotebookText strokeWidth={1.25} size={24} /> },
    { href: "/contact-us", label: t('contactUs'), icon: <Contact strokeWidth={1.25} size={24} /> },
    { href: "/terms-of-use", label: t('usagePolicy'), icon: <Siren strokeWidth={1.25} size={24} /> },
  ];

  const authLinks = [
    { href: "/home", label: t('mainPage'), icon: <House strokeWidth={1.25} size={24} />, activeIcon: <House strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/chats", label: t('chats'), icon: <MessageCircle strokeWidth={1.25} size={24} />, activeIcon: <MessageCircle strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/favorites", label: t('favorits'), icon: <Heart strokeWidth={1.25} size={24} />, activeIcon: <Heart strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/profile", label: t('profile'), icon: <User strokeWidth={1.25} size={24} />, activeIcon: <User strokeWidth={2} size={24} color='#301B69' /> },
  ];

  const mobileAuthLinks = [
    { href: "/home", icon: <House strokeWidth={1.25} size={32} />, activeIcon: <House strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/chats", icon: <MessageCircle strokeWidth={1.25} size={32} />, activeIcon: <MessageCircle strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/favorites", icon: <Heart strokeWidth={1.25} size={32} />, activeIcon: <Heart strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/profile", icon: <User strokeWidth={1.25} size={32} />, activeIcon: <User strokeWidth={2} size={32} color='#301B69' /> },
  ];

  // Check if link is active
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname.endsWith(currentLocale) && (!hash || hash === "");
    } else if (href.startsWith("/#")) {
      const linkHash = href.substring(1); // Remove the leading "/"
      return pathname.endsWith(currentLocale) && hash === linkHash;
    } else {
      return pathname.includes(href);
    }
  };

  return (
    <>

      <div className="w-full fixed top-4 md:top-8 z-50 px-4">
        <div className="flex items-center justify-between max-w-7xl rounded-2xl md:rounded-[24px] mx-auto px-5 py-3 bg-white/80 backdrop-blur-lg shadow-lg">
          {/* Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex-shrink-0">
            <div className='rtl:block ltr:hidden' >
              <svg width="114" height="41" viewBox="0 0 114 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_10506_1244)">
                  <path d="M105.618 38.558C103.546 38.558 102.034 38.068 101.082 37.088C100.102 36.136 99.6115 35.002 99.6115 33.686C99.6115 33.322 99.6255 33.056 99.6535 32.888C100.158 33.308 100.844 33.686 101.712 34.022C102.58 34.358 103.434 34.526 104.274 34.526C105.17 34.526 105.94 34.316 106.584 33.896C107.256 33.504 107.592 32.86 107.592 31.964V11.384C107.592 10.6 107.844 9.96995 108.348 9.49395C108.852 9.01795 109.51 8.77995 110.322 8.77995C111.134 8.77995 111.792 9.01795 112.296 9.49395C112.8 9.96995 113.052 10.628 113.052 11.468V30.956C113.052 32.804 112.52 34.526 111.456 36.122C110.42 37.746 108.474 38.558 105.618 38.558ZM110.364 6.04995C109.496 6.04995 108.754 5.75595 108.138 5.16795C107.55 4.55195 107.256 3.83795 107.256 3.02595C107.256 2.18595 107.55 1.47195 108.138 0.883952C108.754 0.295953 109.496 0.00195312 110.364 0.00195312C111.176 0.00195312 111.876 0.295953 112.464 0.883952C113.08 1.47195 113.388 2.18595 113.388 3.02595C113.388 3.83795 113.08 4.55195 112.464 5.16795C111.876 5.75595 111.176 6.04995 110.364 6.04995Z" fill="url(#paint0_linear_10506_1244)" />
                  <path d="M92.5138 8.77995C94.4738 8.77995 95.9998 9.04595 97.0919 9.57795C98.2119 10.11 99.0518 11.132 99.6118 12.644C100.172 14.156 100.452 16.354 100.452 19.238V30.956C100.452 32.804 99.9199 34.526 98.8559 36.122C97.8198 37.746 95.8738 38.558 93.0178 38.558C90.9458 38.558 89.4199 38.068 88.4398 37.088C87.4878 36.136 87.0118 35.002 87.0118 33.686C87.0118 33.322 87.0258 33.056 87.0538 32.888C87.6138 33.308 88.3138 33.686 89.1538 34.022C89.9939 34.358 90.8338 34.526 91.6738 34.526C92.5698 34.526 93.3399 34.316 93.9838 33.896C94.6558 33.504 94.9918 32.86 94.9918 31.964V28.94L91.0858 29.024C85.7938 29.024 83.1479 25.692 83.1479 19.028C83.1479 16.144 83.6098 13.946 84.5338 12.434C85.4578 10.922 86.5778 9.94195 87.8938 9.49395C89.2378 9.01795 90.7778 8.77995 92.5138 8.77995ZM88.6078 18.776C88.6078 20.428 88.7758 21.8 89.1118 22.892C89.4758 23.956 90.1618 24.488 91.1698 24.488H94.9918V15.71C94.9918 14.842 94.6838 14.212 94.0678 13.82C93.4799 13.428 92.7798 13.232 91.9678 13.232C90.7078 13.232 89.8258 13.694 89.3218 14.618C88.8458 15.542 88.6078 16.928 88.6078 18.776Z" fill="url(#paint1_linear_10506_1244)" />
                  <path d="M77.2524 28.94C76.3004 28.94 75.6004 28.66 75.1524 28.1C74.7324 27.54 74.5224 26.868 74.5224 26.084V7.39395C74.5224 6.27395 74.3544 5.48995 74.0184 5.04195C73.6824 4.59395 73.3744 4.31395 73.0944 4.20195C72.8144 4.08995 72.6464 4.01995 72.5904 3.99195C72.5904 3.71195 72.7024 3.34795 72.9264 2.89995C73.1784 2.45195 73.5564 2.05995 74.0604 1.72395C74.5644 1.38795 75.1944 1.21995 75.9504 1.21995C77.1544 1.21995 78.1204 1.69595 78.8484 2.64795C79.6044 3.59995 79.9824 4.80395 79.9824 6.25995V26.168C79.9824 26.924 79.7584 27.582 79.3104 28.142C78.8904 28.674 78.2044 28.94 77.2524 28.94Z" fill="url(#paint2_linear_10506_1244)" />
                  <path d="M59.5727 8.77995C61.0567 8.77995 62.5547 9.18595 64.0667 9.99795C65.6067 10.782 66.8807 11.93 67.8887 13.442C68.9247 14.954 69.4427 16.732 69.4427 18.776C69.4427 20.092 69.2187 21.534 68.7707 23.102C68.3227 24.642 67.4967 26 66.2927 27.176C65.0887 28.352 63.4507 28.94 61.3787 28.94H51.4247C51.4247 31.432 51.7467 33.504 52.3907 35.156C53.0627 36.808 53.8047 37.9 54.6167 38.432C54.5047 38.852 54.1967 39.23 53.6927 39.566C53.2167 39.93 52.5867 40.112 51.8027 40.112C50.0107 40.112 48.7227 39.258 47.9387 37.55C47.1827 35.87 46.8047 34.008 46.8047 31.964C46.8047 29.696 47.2247 27.89 48.0647 26.546C48.9047 25.174 50.2207 24.488 52.0127 24.488H60.9167C61.3087 24.488 61.7427 24.25 62.2187 23.774C62.7227 23.27 63.1427 22.598 63.4787 21.758C63.8147 20.89 63.9827 19.966 63.9827 18.986C63.9827 16.942 63.2827 15.458 61.8827 14.534C60.4827 13.61 58.8867 13.148 57.0947 13.148H52.9787C52.1107 13.148 51.3687 12.924 50.7527 12.476C50.1647 12.028 49.7167 11.468 49.4087 10.796C49.1007 10.096 48.9467 9.42395 48.9467 8.77995C48.9467 8.24795 49.0447 7.85595 49.2407 7.60395C49.4647 7.32395 49.7167 7.19795 49.9967 7.22595C50.1927 7.64595 50.6967 8.03795 51.5087 8.40195C52.3207 8.73795 53.3847 8.90595 54.7007 8.90595L57.5987 8.82195L59.5727 8.77995ZM59.9927 37.004C59.1247 37.004 58.3827 36.696 57.7667 36.08C57.1787 35.492 56.8847 34.792 56.8847 33.98C56.8847 33.14 57.1787 32.4259 57.7667 31.838C58.3827 31.25 59.1247 30.956 59.9927 30.956C60.8047 30.956 61.5047 31.25 62.0927 31.838C62.7087 32.4259 63.0167 33.14 63.0167 33.98C63.0167 34.792 62.7087 35.492 62.0927 36.08C61.5047 36.696 60.8047 37.004 59.9927 37.004Z" fill="url(#paint3_linear_10506_1244)" />
                  <path d="M32.0893 28.94C31.1373 28.94 30.4373 28.66 29.9893 28.1C29.5693 27.54 29.3593 26.868 29.3593 26.084V7.39395C29.3593 6.27395 29.1913 5.48995 28.8553 5.04195C28.5193 4.59395 28.2113 4.31395 27.9313 4.20195C27.6513 4.08995 27.4833 4.01995 27.4273 3.99195C27.4273 3.71195 27.5393 3.34795 27.7633 2.89995C28.0153 2.45195 28.3933 2.05995 28.8973 1.72395C29.4013 1.38795 30.0313 1.21995 30.7873 1.21995C31.9913 1.21995 32.9573 1.69595 33.6853 2.64795C34.4413 3.59995 34.8193 4.80395 34.8193 6.25995V26.168C34.8193 26.924 34.5953 27.582 34.1473 28.142C33.7273 28.674 33.0413 28.94 32.0893 28.94ZM28.7713 40.826C28.4633 40.77 28.1973 40.588 27.9733 40.28C27.7493 40 27.6373 39.706 27.6373 39.398C27.6373 38.978 27.8193 38.614 28.1833 38.306C28.5473 38.026 29.1073 37.886 29.8633 37.886C29.4153 37.69 29.0093 37.34 28.6453 36.836C28.3093 36.332 28.1413 35.758 28.1413 35.114C28.1413 34.498 28.2953 33.868 28.6033 33.224C28.9393 32.608 29.4433 32.09 30.1153 31.67C30.8153 31.25 31.6693 31.04 32.6773 31.04C33.5453 31.04 34.2313 31.208 34.7353 31.544C35.2393 31.908 35.4913 32.454 35.4913 33.182C35.4913 34.134 35.0573 34.61 34.1893 34.61C33.8813 34.61 33.5033 34.526 33.0553 34.358C33.0833 33.966 32.9993 33.602 32.8033 33.266C32.6353 32.93 32.3553 32.762 31.9633 32.762C31.7393 32.986 31.5433 33.266 31.3753 33.602C31.2073 33.966 31.1233 34.33 31.1233 34.694C31.1233 35.366 31.3893 35.968 31.9213 36.5C32.4533 37.032 33.1253 37.298 33.9373 37.298C34.1893 37.298 34.4833 37.256 34.8193 37.172C35.1553 37.116 35.4073 37.088 35.5753 37.088C35.8833 37.088 36.1073 37.2 36.2473 37.424C36.4153 37.676 36.4993 37.956 36.4993 38.264C36.4993 38.572 36.4293 38.838 36.2893 39.062C36.1493 39.286 35.9673 39.398 35.7433 39.398C34.7353 39.398 33.3213 39.51 31.5013 39.734C29.6813 39.958 28.7713 40.322 28.7713 40.826Z" fill="#E30BCD" />
                  <path d="M12.601 38.852C8.51298 38.852 5.39098 37.83 3.23498 35.786C1.07898 33.742 0.000976562 30.83 0.000976562 27.05C0.000976562 24.894 0.378976 23.032 1.13498 21.464C1.91898 19.896 3.24898 19.112 5.12498 19.112C5.85298 19.112 6.51098 19.238 7.09898 19.49C7.71498 19.714 8.16298 19.966 8.44298 20.246C7.68698 20.778 7.00098 21.688 6.38498 22.976C5.79698 24.236 5.50298 25.706 5.50298 27.386C5.50298 29.654 6.14698 31.39 7.43498 32.594C8.72298 33.826 10.431 34.442 12.559 34.442C14.799 34.442 16.395 33.826 17.347 32.594C18.327 31.362 18.817 29.906 18.817 28.226V11.552C18.817 10.796 19.027 10.152 19.447 9.61995C19.895 9.05995 20.595 8.77995 21.547 8.77995C22.499 8.77995 23.185 9.05995 23.605 9.61995C24.053 10.18 24.277 10.852 24.277 11.636V27.512C24.277 35.072 20.385 38.852 12.601 38.852ZM12.181 8.77995C11.313 8.77995 10.571 8.48595 9.95498 7.89795C9.36698 7.28195 9.07298 6.56795 9.07298 5.75595C9.07298 4.91595 9.36698 4.20195 9.95498 3.61395C10.571 3.02595 11.313 2.73195 12.181 2.73195C12.993 2.73195 13.693 3.02595 14.281 3.61395C14.897 4.20195 15.205 4.91595 15.205 5.75595C15.205 6.56795 14.897 7.28195 14.281 7.89795C13.693 8.48595 12.993 8.77995 12.181 8.77995Z" fill="#E30BCD" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_10506_1244" x1="47.4949" y1="14.5369" x2="47.1223" y2="40.5801" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#271850" />
                    <stop offset="1" stopColor="#301B69" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_10506_1244" x1="47.4949" y1="14.5369" x2="47.1223" y2="40.5801" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#271850" />
                    <stop offset="1" stopColor="#301B69" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_10506_1244" x1="47.4949" y1="14.5369" x2="47.1223" y2="40.5801" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#271850" />
                    <stop offset="1" stopColor="#301B69" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_10506_1244" x1="47.4949" y1="14.5369" x2="47.1223" y2="40.5801" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#271850" />
                    <stop offset="1" stopColor="#301B69" />
                  </linearGradient>
                  <clipPath id="clip0_10506_1244">
                    <rect width="113.387" height="40.8248" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="rtl:hidden ltr:block" >
              <svg width="100" height="36" viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.6301 26.9667V10.5693H88.8471V13.9425L88.2849 14.3173C88.4931 13.5885 88.8991 12.9222 89.503 12.3184C90.1068 11.6937 90.8252 11.194 91.6581 10.8192C92.491 10.4235 93.3447 10.2257 94.2192 10.2257C95.4685 10.2257 96.5096 10.4756 97.3425 10.9753C98.1754 11.4542 98.8 12.1934 99.2165 13.1929C99.6329 14.1923 99.8411 15.4521 99.8411 16.9721V26.9667H96.6241V17.1907C96.6241 16.2537 96.4992 15.4833 96.2493 14.8795C95.9995 14.2548 95.6143 13.8071 95.0937 13.5365C94.5732 13.2449 93.9277 13.12 93.1573 13.1617C92.5326 13.1617 91.96 13.2658 91.4394 13.474C90.9189 13.6614 90.4608 13.9321 90.0652 14.286C89.6904 14.64 89.3885 15.0565 89.1594 15.5354C88.9512 15.9935 88.8471 16.4932 88.8471 17.0346V26.9667H87.2542C86.9835 26.9667 86.7128 26.9667 86.4421 26.9667C86.1715 26.9667 85.9008 26.9667 85.6301 26.9667Z" fill="#E30BCD" />
                <path d="M71.3386 26.9681V23.8448H74.868V8.22826H71.3386V5.10495H81.7705V8.22826H78.2411V23.8448H81.7705V26.9681H71.3386Z" fill="#E30BCD" />
                <path d="M61.4103 33.1204L60.1923 30.653C61.0043 30.653 61.6706 30.5072 62.1912 30.2157C62.7325 29.945 63.1386 29.5286 63.4093 28.9664C63.6799 28.425 63.8153 27.7483 63.8153 26.9362V10.5701H67.0323V27.717C67.0323 28.779 66.7928 29.716 66.3139 30.528C65.8559 31.3401 65.2 31.9752 64.3463 32.4332C63.5134 32.8913 62.5347 33.1204 61.4103 33.1204ZM65.5019 6.94702C64.8148 6.94702 64.2838 6.77003 63.909 6.41606C63.5342 6.06208 63.3468 5.56235 63.3468 4.91687C63.3468 4.31303 63.5342 3.82371 63.909 3.44891C64.3046 3.07412 64.8356 2.88672 65.5019 2.88672C66.189 2.88672 66.72 3.06371 67.0948 3.41768C67.4696 3.77166 67.657 4.27139 67.657 4.91687C67.657 5.52071 67.4592 6.01003 67.0635 6.38483C66.6887 6.75962 66.1682 6.94702 65.5019 6.94702Z" fill="#301B69" />
                <path d="M50.547 27.279C49.1936 27.279 47.9546 26.9042 46.8302 26.1546C45.7267 25.405 44.8417 24.3847 44.1754 23.0938C43.5091 21.8028 43.176 20.3453 43.176 18.7211C43.176 17.0762 43.5091 15.6187 44.1754 14.3485C44.8626 13.0575 45.7787 12.0477 46.9239 11.3189C48.09 10.5901 49.3914 10.2257 50.8281 10.2257C51.6818 10.2257 52.4626 10.3507 53.1706 10.6005C53.8785 10.8504 54.4928 11.2044 55.0133 11.6625C55.5547 12.0997 55.992 12.6099 56.3251 13.1929C56.6791 13.7759 56.8977 14.4006 56.981 15.0669L56.2626 14.817V10.5693H59.5109V26.9667H56.2626V23.0625L57.0122 22.8439C56.8873 23.4061 56.627 23.9579 56.2314 24.4993C55.8566 25.0198 55.3673 25.4883 54.7635 25.9048C54.1804 26.3212 53.5245 26.6544 52.7958 26.9042C52.0878 27.1541 51.3382 27.279 50.547 27.279ZM51.3903 24.3119C52.3689 24.3119 53.233 24.0724 53.9826 23.5935C54.7322 23.1146 55.3152 22.4587 55.7317 21.6258C56.1689 20.7721 56.3876 19.8039 56.3876 18.7211C56.3876 17.6592 56.1689 16.7118 55.7317 15.8789C55.3152 15.0461 54.7322 14.3902 53.9826 13.9112C53.233 13.4323 52.3689 13.1929 51.3903 13.1929C50.4325 13.1929 49.5788 13.4323 48.8292 13.9112C48.1004 14.3902 47.5174 15.0461 47.0801 15.8789C46.6637 16.7118 46.4554 17.6592 46.4554 18.7211C46.4554 19.8039 46.6637 20.7721 47.0801 21.6258C47.5174 22.4587 48.1004 23.1146 48.8292 23.5935C49.5788 24.0724 50.4325 24.3119 51.3903 24.3119Z" fill="#301B69" />
                <path d="M24.3692 26.9678L18.7785 10.5705L22.0267 10.5392L26.0246 22.8138L25.3062 22.7514L29.6476 13.1628H31.5841L35.9567 22.7826L35.1134 22.8451L39.1425 10.5705H42.3907L36.8625 26.9678H34.6449L30.0849 16.536L30.8032 16.6297L26.5555 26.9678H24.3692Z" fill="#301B69" />
                <path d="M0 26.9681V24.5007L12.462 7.82223L12.9305 8.35319H0.812061V5.10495H16.6472V7.54113L4.2477 24.2508L3.74797 23.7199H16.9908V26.9681H0Z" fill="#301B69" />
              </svg>

            </div>
          </Link>

          {/* Navigation Links - Center */}
          <nav className="hidden lg:block">
            <div className="flex items-center justify-around gap-6">
              {(isAuthenticated ? authLinks : guestLinks).map(link => {
                const isActive = isLinkActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === "/") {
                        e.preventDefault();
                        handleMainPageClick(link.href);
                      } else if (link.href.startsWith("/#")) {
                        e.preventDefault();
                        handleHashClick(link.href);
                      }
                      // For other links like "/contact-us", "/terms-of-use", etc., let the Link component handle the navigation normally
                      // Don't prevent default - let the localized Link component work
                      setNavKey(navKey + 1);
                    }}
                    className={`text-[#301B69] hover:text-[#301B69] p-1 text-lg transition-colors
                    ${isActive ? "border-b-2 border-[#301B69] font-bold" : "font-medium"}
                  `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right side - Language toggle and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button onClick={toggleLanguage} variant={"ghost"} className='font-sans hover:decoration-0 text-2xl flex items-center gap-2 font-bold p-1'>
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 1L19 5M19 5L15 9M19 5H5C3.93913 5 2.92172 5.42143 2.17157 6.17157C1.42143 6.92172 1 7.93913 1 9V11M5 23L1 19M1 19L5 15M1 19H15C16.0609 19 17.0783 18.5786 17.8284 17.8284C18.5786 17.0783 19 16.0609 19 15V13" stroke="#090909" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {t('languageToggle')}
            </Button>
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu dir={currentLocale === "ar" ? 'rtl' : 'ltr'}>
                <DropdownMenuTrigger className='flex items-center gap-4 px-4 py-3 rounded-[16px] text-lg font-normal transition-all disabled:opacity-50 shrink-0 bg-gradient-to-b from-[#6B3FA0] to-[#2D0B5A] text-white shadow-[0_4px_24px_0_rgba(80,40,160,0.10),inset_0_2px_8px_0_rgba(255,255,255,0.20)] border-[3px] border-[#E5DDF7]'>
                  {t("accountMenu.myAccount")}<ChevronDown size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[1.6rem] ltr:-translate-x-[1.2rem]'>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Link href="/contact-us" className='flex items-center gap-3 w-full'>
                      <Headset size={22} color='#301B69' />
                      {t("accountMenu.contactUs")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Link href="/profile" className='flex items-center gap-3 w-full'>
                      <User size={22} color='#301B69' />
                      {t("accountMenu.profile")}
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <FileText size={22} color='#301B69' />
                    {t("accountMenu.invoices")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Package size={22} color='#301B69' />
                    {t("accountMenu.subscriptions")}
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    className='text-[#FF3B30] font-medium text-lg'
                    onClick={logout}
                  >
                    <Power size={22} color='#FF3B30' />
                    {t("accountMenu.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/sign-in">
                <Button>
                  {t('loginButton')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger className="text-gray-700 hover:text-[#301B69] lg:hidden">
              <Menu strokeWidth={1.25} size={30} />
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col items-start justify-around gap-6">
                {(isAuthenticated ? authLinks : guestLinks).map(link => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href === "/") {
                          e.preventDefault();
                          handleMainPageClick(link.href);
                        } else if (link.href.startsWith("/#")) {
                          e.preventDefault();
                          handleHashClick(link.href);
                        }
                        // For other links, let the Link component handle navigation
                        setNavKey(navKey + 1);
                      }}
                      className={`flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg transition-colors
                      ${isActive ? "font-bold" : "font-medium"}
                    `}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
                <Button onClick={toggleLanguage} variant={"ghost"} className='flex md:hidden items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors'>
                  <RefreshCcw size={24} />
                  {t('languageToggle')}
                </Button>
                {!isAuthenticated ? (
                  <Link href="/auth/sign-in" className='w-full'>
                    <Button className='w-full block md:hidden rounded-[50px]'
                      style={{
                        background: "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
                      }}>
                      {t('loginButton')}
                    </Button>
                  </Link>
                ) : (
                  <Button className='w-full block md:hidden rounded-[50px] bg-red-600 hover:bg-red-700'
                    onClick={logout}
                  >
                    {t("accountMenu.logout")}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isAuthenticated && <div className="w-full fixed bottom-6 z-50 px-4 block md:hidden">
        <div className="flex items-center justify-center gap-6 rounded-4xl mx-auto px-6 py-3 bg-white shadow-lg">
          {mobileAuthLinks.map(link => {
            const isActive = isLinkActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setNavKey(navKey + 1)}
                className={`text-[#BFC6CC] p-1 text-lg transition-colors`}
              >
                {isActive ? link.activeIcon : link.icon}
              </Link>
            );
          })}
        </div>
      </div>}
    </>
  );
};

export default Navbar;
