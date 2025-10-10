import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useTranslations } from "next-intl";


const TermsAndConditions = () => {
    const t = useTranslations("terms");
    return (
        <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
            style={{
                // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
            }}>
            <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
            <div className='max-w-7xl mx-auto px-4 md:px-0 relative z-2'>
                <div className='grid grid-cols-1 md:grid-cols-7 gap-8'>
                    <div className='md:col-span-2 '>
                        <div className='rounded-3xl overflow-hidden relative'>
                            <Image src="/photos/terms-img.webp" alt='Terms Background' width={100} height={100} className='w-full' />
                            <h3 className='text-3xl font-bold text-center px-6 absolute bottom-8 inset-x-0 z-4'
                                style={{
                                    background: 'linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                }}>{t("imageHeading")}</h3>
                            <div className='w-full h-12 bg-white -mt-4 relative z-2 text-3xl font-bold'
                                style={{
                                    boxShadow: "#fff 0px -20px 50px 80px"
                                }}></div>
                        </div>
                    </div>
                    <div className='md:col-span-5 flex flex-col items-start gap-3 md:gap-4 rounded-3xl p-6 shadow-lg'
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 255, 255, 0.256) 100%)',
                        }}>
                        <h3 className='text-2xl md:text-4xl font-semibold'>{t("title")}</h3>
                        <p className=' text-xl md:text-2xl leading-relaxed text-justify'>

                            {t("religiousIntro")}<br /> {t("introduction")}

                        </p>
                        {Array.from({ length: 14 }).map((_, idx) => {
                            const key = `content${idx + 1}`;
                            const value = t(key);
                            return value && value !== key ? (
                                <p key={key} className="text-lg leading-relaxed">{value}</p>
                            ) : null;
                        })}
                        <Button className='mt-8'>{t("agreeButton")}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions