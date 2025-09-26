"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

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
        <div className="w-full fixed top-8 z-50">
            <div className="flex items-center justify-between max-w-7xl rounded-[24px] mx-auto px-5 py-3 bg-white">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <div className="text-4xl font-bold">
                        <span className="text-[#301B69]">زواج</span>{" "}
                        <span className="text-[#E30BCD]">إن</span>
                    </div>
                </div>

                {/* Navigation Links - Center */}
                <nav className="hidden md:block">
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
                <div className="flex items-center space-x-4">
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
                <div className="md:hidden">
                    <button className="text-gray-700 hover:text-[#301B69]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;