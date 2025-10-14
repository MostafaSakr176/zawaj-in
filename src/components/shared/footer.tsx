"use client";
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
    const t = useTranslations("footerSection");
    const { isAuthenticated } = useAuth();
    return (
        <footer className="w-full text-center mt-20"
            style={{
                backgroundImage: "url('/photos/footer-bg.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
            <div className='w-full h-full pt-12 pb-6 px-4 bg-gradient-to-b from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.0)]'>
                <div className='max-w-7xl mx-auto flex flex-col items-center gap-8'>
                    <div className='flex flex-col items-center text-center gap-4 max-w-3xl mx-auto px-4 '>
                        <span className="mx-auto text-[#301B69] text-sm font-semibold px-3 py-1 rounded-full border-2 border-white flex items-center gap-2"
                            style={{ background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)" }}>
                            {t(`badge`)}
                            <Star size={16} />
                        </span>
                        <h2
                            className="text-4xl lg:text-7xl font-bold leading-[120%] text-center bg-clip-text text-transparent"
                            style={{
                                backgroundImage: "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)"
                            }}
                        >
                            {t("title")}
                        </h2>
                        <p className="text-base md:text-lg font-medium text-[#301B69] text-center">
                            {t("subtitle")}
                        </p>
                    </div>
                    {/* CTA Button */}
                    {!isAuthenticated && <Link href="/auth/register">
                        <Button>
                            {t("cta")}
                            <ArrowLeft size={16} className='rtl:inline-block ltr:hidden' />
                            <ArrowRight size={16} className='rtl:hidden ltr:inline-block' />
                        </Button>
                    </Link>}
                    {/* Social Icons */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        <Link href="/" className="flex-shrink-0">
                            <Image src="/photos/logo-ar.webp" alt="" width={113} height={40} className='rtl:block ltr:hidden' />
                            <Image src="/photos/logo-en.webp" alt="" width={113} height={40} className="rtl:hidden ltr:block" />
                        </Link>
                        <div className='flex items-center gap-2'>
                            <Button size="icon">
                                <Image src="/icons/footer/f_1_.webp" alt="Facebook" width={24} height={24} className='w-6 h-6' />
                            </Button>
                            <Button size="icon">
                                <Image src="/icons/footer/f_1_.webp" alt="Facebook" width={24} height={24} className='w-6 h-6' />
                            </Button>
                            <Button size="icon">
                                <Image src="/icons/footer/f_1_.webp" alt="Facebook" width={24} height={24} className='w-6 h-6' />
                            </Button>
                            <Button size="icon">
                                <Image src="/icons/footer/f_1_.webp" alt="Facebook" width={24} height={24} className='w-6 h-6' />
                            </Button>
                            <Button size="icon">
                                <Image src="/icons/footer/f_1_.webp" alt="Facebook" width={24} height={24} className='w-6 h-6' />
                            </Button>
                        </div>
                    </div>
                    {/* Logo and Copyright */}
                    <hr className="w-full border-[#301B6929]" />

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[#301B69] text-sm">© زواج إن 2025 جميع الحقوق محفوظة</span>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;