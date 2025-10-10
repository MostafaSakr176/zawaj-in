"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookUser, ChevronDown, FileText, Headset, Heart, House, Menu, MessageCircle, Package, Power, RefreshCcw, User } from 'lucide-react';
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

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1];

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  // Navigation links for guests and authenticated users
  const guestLinks = [
    { href: "/", label: t('mainPage'), icon: <House strokeWidth={1.75} size={24} />, bold: true },
    { href: "#", label: t('whoAreWe'), icon: <BookUser strokeWidth={1.25} size={24} /> },
    { href: "#subscriptions", label: t('subscriptions'), icon: <House strokeWidth={1.25} size={24} /> },
    { href: "#userOpinion", label: t('userOpinion'), icon: <House strokeWidth={1.25} size={24} /> },
    { href: "/contact-us", label: t('contactUs'), icon: <House strokeWidth={1.25} size={24} /> },
    { href: "/terms-of-use", label: t('usagePolicy'), icon: <House strokeWidth={1.25} size={24} /> },
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

  return (
    <>
      <div className="w-full fixed top-4 md:top-8 z-50 px-4">
        <div className="flex items-center justify-between max-w-7xl rounded-2xl md:rounded-[24px] mx-auto px-5 py-3 bg-white/80 backdrop-blur-lg shadow-lg">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/photos/logo-ar.webp" alt="" width={113} height={40} className='rtl:block ltr:hidden' />
            <Image src="/photos/logo-en.webp" alt="" width={113} height={40} className="rtl:hidden ltr:block" />
          </Link>

          {/* Navigation Links - Center */}
          <nav className="hidden lg:block">
            <div className="flex items-center justify-around gap-6">
              {(isAuthenticated ? authLinks : guestLinks).map(link => {
                const isActive = pathname.includes(link.href) || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
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
              <RefreshCcw size={24} />
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
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <FileText size={22} color='#301B69' />
                    {t("accountMenu.invoices")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Package size={22} color='#301B69' />
                    {t("accountMenu.subscriptions")}
                  </DropdownMenuItem>
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
                  const isActive = pathname.includes(link.href) || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
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
                {!isAuthenticated && (
                  <Link href="/auth/sign-in" className='w-full'>
                    <Button className='w-full block md:hidden rounded-[50px]'
                      style={{
                        background: "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
                      }}>
                      {t('loginButton')}
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isAuthenticated && !pathname.includes("/chats") && <div className="w-full fixed bottom-8 z-50 px-4 block md:hidden">
        <div className="flex items-center justify-center gap-6 rounded-4xl mx-auto px-6 py-3 bg-white shadow-lg">
          {mobileAuthLinks.map(link => {
            const isActive = pathname.includes(link.href) || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
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
