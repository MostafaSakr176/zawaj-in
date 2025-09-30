"use client";
import { useTranslations } from 'next-intl';
import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';

const PlatformStatistics = () => {
    const t = useTranslations('stats');

    return (
        <div className='max-w-7xl mx-auto pt-16 pb-20 px-4'>
            <div className='flex items-center mx-auto w-fit'>
                <Image src={"/photos/heading-smoth-shape-right.svg"} alt="Heading Shape" width={40} height={25} className='-ml-1 relative z-2' />
                <div className='w-fit border border-white shadow-md rounded-3xl lg:rounded-4xl px-4 md:px-6 py-2 flex items-center gap-2 md:gap-4'
                    style={{
                        background: 'linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)'
                    }}>
                    <span className='text-lg md:text-xl text-black font-semibold'>{t('title')}</span>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        <Avatar className='w-6 h-6'>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar className='w-6 h-6'>
                            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
                            <AvatarFallback>LR</AvatarFallback>
                        </Avatar>
                        <Avatar className='w-6 h-6'>
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                    </div>

                </div>
                <Image src={"/photos/heading-smoth-shape-left.svg"} alt="Heading Shape" width={40} height={25} className='-mr-1 relative z-2' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-10'>
                <div className='flex flex-col items-center gap-6 p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300'
                style={{
                    background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"

                }}> 
                    <Image src={"/photos/male-icon.svg"} alt="Success Rate Icon" width={48} height={48} />
                    <p className='text-lg font-semibold text-[#301B69]'>{t('registered_males')}</p>
                    <p className='text-[#301B69] font-bold text-5xl'>300</p>
                </div>
                <div className='flex flex-col items-center gap-6 p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300'
                style={{
                    background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"

                }}> 
                    <Image src={"/photos/male-icon.svg"} alt="Success Rate Icon" width={48} height={48} />
                    <p className='text-lg font-semibold text-[#301B69]'>{t('registered_males')}</p>
                    <p className='text-[#301B69] font-bold text-5xl'>300</p>
                </div>
                <div className='flex flex-col items-center gap-6 p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300'
                style={{
                    background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"

                }}> 
                    <Image src={"/photos/male-icon.svg"} alt="Success Rate Icon" width={48} height={48} />
                    <p className='text-lg font-semibold text-[#301B69]'>{t('registered_males')}</p>
                    <p className='text-[#301B69] font-bold text-5xl'>300</p>
                </div>
                <div className='flex flex-col items-center gap-6 p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300'
                style={{
                    background: "linear-gradient(201.17deg, #F5E6FF -4.98%, #FFF4EA 119.25%)"

                }}> 
                    <Image src={"/photos/male-icon.svg"} alt="Success Rate Icon" width={48} height={48} />
                    <p className='text-lg font-semibold text-[#301B69]'>{t('registered_males')}</p>
                    <p className='text-[#301B69] font-bold text-5xl'>300</p>
                </div>
            </div>
        </div>
    )
}

export default PlatformStatistics