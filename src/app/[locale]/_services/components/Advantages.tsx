"use client"
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import React from 'react'

const Advantages = () => {
    const t = useTranslations("advantages");
    return (
        <div className='w-full p-4 lg:py-16 md:max-w-[95%] mx-auto rounded-[48px]'
            style={{ background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)" }}>
            <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='flex flex-col justify-center items-start gap-4'>
                    <h6 className='rounded-3xl shadow-sm px-4 py-2 bg-white text-[#301B69] font-medium text-sm flex items-center gap-2'>
                        <Image src={"/icons/MagicWand.svg"} alt="Advantages Icon" width={20} height={20} />
                        {t("features")}
                    </h6>
                    <h2 className='text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal'>
                        {t("title")}
                    </h2>
                    <p className='text-lg font-medium text-[#301B69]'>{t("subtitle")}</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
                        <div className='flex flex-col items-start gap-4 pe-8 py-8 border-b rtl:md:border-l ltr:md:border-r border-[#301B6914]'>
                            <div className='flex items-center gap-4'>
                                <Image src={"/icons/phone-heart.svg"} alt="Advantages Icon" width={30} height={30} />
                                <p className='text-2xl font-semibold text-[#301B69]'>{t("registerTitle")}</p>
                            </div>
                            <p className='text-[16px] font-semibold text-[#301B69C2]'>{t("registerDesc")}</p>
                        </div>
                        <div className='flex flex-col items-start gap-4 ps-8 py-8 border-b border-[#301B6914]'>
                            <div className='flex items-center gap-4'>
                                <Image src={"/icons/wedding-rings.svg"} alt="Advantages Icon" width={30} height={30} />
                                <p className='text-2xl font-semibold text-[#301B69]'>{t("stepTitle")}</p>
                            </div>
                            <p className='text-[16px] font-semibold text-[#301B69C2]'>{t("stepDesc")}</p>
                        </div>
                        <div className='flex flex-col items-start gap-4 pe-8 py-8 border-b md:border-b-0 rtl:md:border-l ltr:md:border-r border-[#301B6914]'>
                            <div className='flex items-center gap-4'>
                                <Image src={"/icons/love-hate.svg"} alt="Advantages Icon" width={30} height={30} />
                                <p className='text-2xl font-semibold text-[#301B69]'>{t("preferencesTitle")}</p>
                            </div>
                            <p className='text-[16px] font-semibold text-[#301B69C2]'>{t("preferencesDesc")}</p>
                        </div>
                        <div className='flex flex-col items-start gap-4 ps-8 py-8 '>
                            <div className='flex items-center gap-4'>
                                <Image src={"/icons/checklist.svg"} alt="Advantages Icon" width={30} height={30} />
                                <p className='text-2xl font-semibold text-[#301B69]'>{t("paymentTitle")}</p>
                            </div>
                            <p className='text-[16px] font-semibold text-[#301B69C2]'>{t("paymentDesc")}</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center relative min-h-[420px]'>
                    {/* Circular ring */}
                    <div className="relative w-[380px] h-[380px] md:w-[500px] md:h-[500px] rounded-full border-[25px] border-white">
                    {/* Center logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none">
                        <span className="text-6xl md:text-7xl font-bold" style={{ fontFamily: 'inherit' }}>
                            <span className="text-[#301B69]">زواج</span>{" "}
                            <span className="text-[#E30BCD]">إن</span>
                        </span>
                    </div>
                    {/* Top icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-14 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon1.svg" alt="heart" width={42} height={42} />
                    </div>
                    {/* Top right icon */}
                    <div className="absolute -right-[10%] top-1/5 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon2.svg" alt="search" width={42} height={42} />
                    </div>
                    {/* Bottom right icon */}
                    <div className="absolute -right-[10%] bottom-1/5 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon3.svg" alt="document" width={42} height={42} />
                    </div>
                    {/* Bottom icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon4.svg" alt="ring" width={42} height={42} />
                    </div>
                    {/* Bottom left icon */}
                    <div className="absolute -left-[10%] bottom-1/5 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon5.svg" alt="heart hand" width={42} height={42} />
                    </div>
                    {/* Top left icon */}
                    <div className="absolute -left-[10%] top-1/5 bg-white rounded-full shadow-sm w-22 h-22 flex items-center justify-center">
                        <Image src="/icons/advantages section/circle-shape/icon6.svg" alt="chat heart" width={42} height={42} />
                    </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Advantages