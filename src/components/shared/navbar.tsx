"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookUser, ChevronDown, FileText, Headset, Heart, House, Menu, MessageCircle, Package, RefreshCcw, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from '@/i18n/navigation';

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const t = useTranslations("navbar");
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1];

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="w-full fixed top-4 md:top-8 z-50 px-4">
      <div className="flex items-center justify-between max-w-7xl rounded-2xl md:rounded-[24px] mx-auto px-5 py-3 bg-white/80 backdrop-blur-lg shadow-lg">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="text-4xl font-bold">
            <span className="text-[#301B69]">زواج</span>{" "}
            <span className="text-[#E30BCD]">إن</span>
          </div>
        </Link>

        {/* Navigation Links - Center */}
        <nav className="hidden lg:block">
          <div className="flex items-center justify-around gap-6">
            {
              !isLogin ? <>
                <Link href="/" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-bold transition-colors border-b-2 border-[#301B69] ">
                  {t('mainPage')}
                </Link>
                <Link href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('whoAreWe')}
                </Link>
                <Link href="#subscriptions" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('subscriptions')}
                </Link>
                <Link href="#userOpinion" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('userOpinion')}
                </Link>
                <Link href="/contact-us" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('contactUs')}
                </Link>
                <Link href="/terms-of-use" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('usagePolicy')}
                </Link>
              </> : <>
                <Link href="/home" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-bold transition-colors border-b-2 border-[#301B69] ">
                  {t('mainPage')}
                </Link>
                <Link href="/chats" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('chats')}
                </Link>
                <Link href="/favorites" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('favorits')}
                </Link>
                <Link href="/profile" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  {t('profile')}
                </Link>
              </>
            }

          </div>
        </nav>

        {/* Right side - Language toggle and Login */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Toggle */}
          <Button onClick={toggleLanguage} variant={"ghost"} className='font-sans hover:decoration-0 text-2xl flex items-center gap-2 font-bold p-1'>
            <RefreshCcw size={24} />
            {t('languageToggle')}
          </Button>
          {/* Login Button */}
            {isLogin ? (
              <DropdownMenu dir={currentLocale === "ar" ? 'rtl' : 'ltr'} >
                <DropdownMenuTrigger className='flex items-center gap-4 px-4 py-3 rounded-[16px] text-lg font-normal transition-all disabled:opacity-50 shrink-0 bg-gradient-to-b from-[#6B3FA0] to-[#2D0B5A] text-white shadow-[0_4px_24px_0_rgba(80,40,160,0.10),inset_0_2px_8px_0_rgba(255,255,255,0.20)] border-[3px] border-[#E5DDF7]'> حسابي<ChevronDown size={20} /></DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[1.6rem] ltr:-translate-x-[1.2rem]'>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Headset size={22} />
                    تواصل معنا
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <User size={22} />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <FileText size={22} />
                    الفواتير
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Package size={22} />
                    الاشتراك
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // <Link href="/auth/sign-in">
                <Button onClick={()=>setIsLogin(true)}>
                  {t('loginButton')}
                </Button>
              // </Link>
            )}

        </div>

        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger className="text-gray-700 hover:text-[#301B69] lg:hidden">
            <Menu strokeWidth={1.25} size={30} />
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col items-start justify-around gap-6">
              {!isLogin ? (<>
                <Link href="/" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-bold transition-colors">
                  <House strokeWidth={1.75} size={24} /> {t('mainPage')}
                </Link>
                <Link href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <BookUser strokeWidth={1.25} size={24} /> {t('whoAreWe')}
                </Link>
                <Link href="#subscriptions" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <House strokeWidth={1.25} size={24} /> {t('subscriptions')}
                </Link>
                <Link href="#userOpinion" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <House strokeWidth={1.25} size={24} /> {t('userOpinion')}
                </Link>
                <Link href="/contact-us" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <House strokeWidth={1.25} size={24} /> {t('contactUs')}
                </Link>
                <Link href="/terms-of-use" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <House strokeWidth={1.25} size={24} /> {t('usagePolicy')}
                </Link>
                <Button onClick={toggleLanguage} variant={"ghost"} className='flex md:hidden items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors'>
                  <RefreshCcw size={24} />
                  {t('languageToggle')}
                </Button>
                <Link href="/auth/sign-in" className='w-full'>
                  <Button className='w-full block md:hidden rounded-[50px]'
                    style={{
                      background: "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
                    }}>
                    {t('loginButton')}
                  </Button>
                </Link>
              </>) : (<>
                <Link href="/home"className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <House strokeWidth={1.25} size={24} />
                  {t('mainPage')}
                </Link>
                <Link href="/chats" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <MessageCircle strokeWidth={1.25} size={24} />
                  {t('chats')}
                </Link>
                <Link href="/favorites" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <Heart strokeWidth={1.25} size={24} />
                  {t('favorits')}
                </Link>
                <Link href="/profile" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                  <User strokeWidth={1.25} size={24} />
                  {t('profile')}
                </Link>
                <Button onClick={toggleLanguage} variant={"ghost"} className='flex md:hidden items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors'>
                  <RefreshCcw size={24} />
                  {t('languageToggle')}
                </Button>
              </>)}


            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
