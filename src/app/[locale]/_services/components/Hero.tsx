"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Hero = () => {
    const t = useTranslations('hero');

    return (
    <div className="pt-40 md:pt-48 pb-20 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                    {/* Right side - Content */}
                    <div>
                        {/* Welcome text */}
                        <p
                            className="text-xl md:text-3xl mb-4 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: 'linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)'
                            }}
                        >
                            {t('welcomeText')}
                        </p>

                        {/* Main title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-[#301B69] mb-6 leading-normal">
                            <span>{t('mainTitle')}</span>
                            <br />
                            <span>{t('subtitle')}</span>
                        </h1>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button>
                                <ArrowRight size={16} className='rtl:inline-block ltr:hidden' />
                                <ArrowLeft size={16} className='rtl:hidden ltr:inline-block' />
                                {t('registerButton')}
                            </Button>
                            <Button variant="secondary">
                                {t('newRegisterButton')}
                            </Button>
                        </div>
                    </div>

                    {/* Left side - Image and Stats */}
                    <div className="flex justify-end rtl:lg:pl-8 ltr:lg:pr-8">
                        <div className='relative w-[90%] mx-auto lg:w-[70%]'>
                            <Image
                                src="/photos/hero-img.png"
                                alt="Couple silhouette"
                                width={320}
                                height={400}
                                className="w-full object-cover"
                            />

                            {/* Success Rate Card */}
                            <div className="absolute -top-8 rtl:-left-4 ltr:-right-4 rtl:md:-left-8 ltr:md:-right-8 border-[0.84px] border-[#ECEFF2] bg-[white] rounded-xl md:rounded-3xl px-2 md:px-4 pt-2 shadow-lg z-10">
                                <div className="text-center">
                                    <div className="relative w-28 h-18 md:w-36 md:h-24 mx-auto">
                                        {/* Half-circle progress */}
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
                                        <div className="w-full absolute top-5 md:top-6 left-[50%] transform -translate-x-1/2 flex flex-col items-center justify-center">
                                            <span className="text-md md:text-2xl font-semibold font-sans text-[#343B46]">{t('successRate')}</span>
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">{t('successRateLabel')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Brain Icon */}
                            <div
                                className="absolute -top-4 rtl:-right-4 ltr:-left-4 md:-top-8 rtl:md:-right-8 ltr:md:-left-8 rounded-full p-3 md:p-4 shadow-lg z-10 border-3 border-white"
                                style={{
                                    background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)'
                                }}
                            >
                                <Image src={"/photos/vows.svg"} alt='icon' width={32} height={32} className='w-6 h-6 md:w-8 md:h-8' />
                            </div>

                            {/* Bottom Icons Card */}
                            <div className="w-52 absolute -bottom-10 md:-bottom-6 rtl:-right-4 ltr:-left-4 rtl:md:-right-8 ltr:md:-left-8 bg-white rounded-xl md:rounded-2xl px-4 md:px-6 py-3 shadow-lg z-10">
                                <div className="flex flex-col items-start gap-2">
                                    <div className="flex -space-x-2">
                                        <div
                                            className="rounded-full p-2 shadow-lg"
                                            style={{
                                                background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)'
                                            }}
                                        >
                                            <Image src={"/photos/vows.svg"} alt='icon' width={24} height={24} className='w-4 h-4 md:w-6 md:h-6' />
                                        </div>
                                        <div
                                            className="rounded-full p-2 shadow-lg"
                                            style={{
                                                background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)'
                                            }}
                                        >
                                            <Image src={"/photos/vows.svg"} alt='icon' width={24} height={24} className='w-4 h-4 md:w-6 md:h-6' />
                                        </div>
                                        <div
                                            className="rounded-full p-2 shadow-lg"
                                            style={{
                                                background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)'
                                            }}
                                        >
                                            <Image src={"/photos/vows.svg"} alt='icon' width={24} height={24} className='w-4 h-4 md:w-6 md:h-6' />
                                        </div>
                                        <div
                                            className="rounded-full p-2 shadow-lg"
                                            style={{
                                                background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)'
                                            }}
                                        >
                                            <Image src={"/photos/vows.svg"} alt='icon' width={24} height={24} className='w-4 h-4 md:w-6 md:h-6' />
                                        </div>
                                    </div>
                                    <div className="text-sm text-[#301B69]">
                                        <p className="font-medium">{t('zodiacText')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;