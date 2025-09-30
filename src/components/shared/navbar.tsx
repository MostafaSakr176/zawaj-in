"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookUser, House, Menu, RefreshCcw } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
    const t = useTranslations('navbar');
    const router = useRouter();
    const pathname = usePathname();

    // Extract current locale from pathname
    const currentLocale = pathname.split('/')[1];

    const toggleLanguage = () => {
        const newLocale = currentLocale === 'ar' ? 'en' : 'ar';
        const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <div className="w-full fixed top-4 md:top-8 z-50 px-4">
            <div className="flex items-center justify-between max-w-7xl rounded-2xl md:rounded-[24px] mx-auto px-5 py-3 bg-white/80 backdrop-blur-lg shadow-lg">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <div className="text-4xl font-bold">
                        <span className="text-[#301B69]">زواج</span>{" "}
                        <span className="text-[#E30BCD]">إن</span>
                    </div>
                </div>

                {/* Navigation Links - Center */}
                <nav className="hidden lg:block">
                    <div className="flex items-center justify-around gap-6">
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-bold transition-colors border-b-2 border-[#301B69] ">
                            {t('mainPage')}
                        </a>
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                            {t('whoAreWe')}
                        </a>
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                            {t('subscriptions')}
                        </a>
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                            {t('userOpinion')}
                        </a>
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                            {t('contactUs')}
                        </a>
                        <a href="#" className="text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                            {t('usagePolicy')}
                        </a>
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
                    <Button>
                        {t('loginButton')}
                    </Button>
                </div>

                {/* Mobile menu button */}
                <Sheet>
                    <SheetTrigger className="text-gray-700 hover:text-[#301B69] lg:hidden">
                        <Menu strokeWidth={1.25} size={30} />
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col items-start justify-around gap-6">
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-bold transition-colors">
                                <House strokeWidth={1.75} size={24} /> {t('mainPage')}
                            </a>
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                                <BookUser strokeWidth={1.25} size={24} /> {t('whoAreWe')}
                            </a>
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                                <House strokeWidth={1.25} size={24} /> {t('subscriptions')}
                            </a>
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                                <House strokeWidth={1.25} size={24} /> {t('userOpinion')}
                            </a>
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                                <House strokeWidth={1.25} size={24} /> {t('contactUs')}
                            </a>
                            <a href="#" className="flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors">
                                <House strokeWidth={1.25} size={24} /> {t('usagePolicy')}
                            </a>
                            <Button onClick={toggleLanguage} variant={"ghost"} className='flex md:hidden items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors'>
                                <RefreshCcw size={24} />
                                {t('languageToggle')}
                            </Button>
                            <Button className='w-full block md:hidden'>
                                {t('loginButton')}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;