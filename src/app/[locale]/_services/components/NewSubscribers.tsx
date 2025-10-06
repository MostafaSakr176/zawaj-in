"use client";

import React from "react";
import IdCard from '@/components/shared/IdCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import "swiper/css";
import "swiper/css/pagination";
import Select from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const NewSubscribers = () => {
    const t = useTranslations("filters");

    return (
        <section id="subscriptions" className='max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px]'
            style={{
                background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)"
            }}
        >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center mb-8">
                احدث الاعضاء الجدد
            </h2>

            <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="all">
                    <TabsList className='w-full md:w-full my-10 md:mb-6 md:mt-0 flex gap-4 items-center justify-center flex-col-reverse md:flex-row'>
                        <div className="flex gap-1 items-center">
                            <TabsTrigger value="all" className="!rounded-[15px]">{t("all")}</TabsTrigger>
                            <TabsTrigger value="males" className="!rounded-[15px]">{t("males")}</TabsTrigger>
                            <TabsTrigger value="females" className="!rounded-[15px]">{t("females")}</TabsTrigger>
                        </div>
                        <div className="flex items-center gap-2">
                            <FormField required className="w-30">
                                <Select
                                    className="bg-white/40"
                                    options={[
                                        { value: "sa", label: "السعودية" },
                                        { value: "eg", label: "مصر" },
                                    ]}
                                    placeholder={t("country")}
                                />
                            </FormField>
                            <FormField required className="w-30">
                                <Select
                                    className="bg-white/40"
                                    options={[
                                        { value: "riyadh", label: "الرياض" },
                                        { value: "jeddah", label: "جدة" },
                                    ]}
                                    placeholder={t("city")}
                                />
                            </FormField>
                            <FormField required className="w-30">
                                <Select
                                    className="bg-white/40"
                                    options={[
                                        { value: "normalMarriage", label: "زواج عادي" },
                                        { value: "misyarMarriage", label: "زواج مسيار" },
                                    ]}
                                    placeholder={t("marriageType")}
                                />
                            </FormField>
                        </div>
                    </TabsList>

                    <TabsContent value="all">
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                            <IdCard isFav={true} name='أحمد' avatar='/photos/male-icon.svg' age={28} city="الرياض" job="teacher" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={false} name='فاطمة' avatar='/icons/female-img.png' age={24} city="جدة" job="engineer" marriageType="misyarMarriage" skinColor="mediumSkin" status="single" />
                            <IdCard isFav={true} name='محمد' avatar='/photos/male-icon.svg' age={32} city="الدمام" job="doctor" marriageType="normalMarriage" skinColor="darkSkin" status="divorced" />
                            <IdCard isFav={true} name='عائشة' avatar='/icons/female-img.png' age={26} city="مكة" job="lawyer" marriageType="temporaryMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={false} name='علي' avatar='/photos/male-icon.svg' age={30} city="المدينة" job="businessman" marriageType="normalMarriage" skinColor="mediumSkin" status="single" />
                            <IdCard isFav={true} name='خديجة' avatar='/icons/female-img.png' age={22} city="الطائف" job="student" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={true} name='عائشة' avatar='/icons/female-img.png' age={26} city="مكة" job="lawyer" marriageType="temporaryMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={false} name='علي' avatar='/photos/male-icon.svg' age={30} city="المدينة" job="businessman" marriageType="normalMarriage" skinColor="mediumSkin" status="single" />
                            <IdCard isFav={true} name='خديجة' avatar='/icons/female-img.png' age={22} city="الطائف" job="student" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                        </div>
                        <div className="h-px bg-[#301B6914] mt-6 mb-3" />
                        {/* Pagination */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                   {t("prev")} 
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                    {t("next")}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#8A97AB] text-sm">Page 1 of 100</span>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="males">
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <IdCard isFav={true} name='أحمد' avatar='/photos/male-icon.svg' age={28} city="الرياض" job="teacher" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={false} name='محمد' avatar='/photos/male-icon.svg' age={32} city="الدمام" job="doctor" marriageType="normalMarriage" skinColor="darkSkin" status="divorced" />
                            <IdCard isFav={true} name='علي' avatar='/photos/male-icon.svg' age={30} city="المدينة" job="businessman" marriageType="normalMarriage" skinColor="mediumSkin" status="single" />
                            <IdCard isFav={true} name='علي' avatar='/photos/male-icon.svg' age={30} city="المدينة" job="businessman" marriageType="normalMarriage" skinColor="mediumSkin" status="single" />
                        </div>

                        {/* Pagination */}
                        <div className="h-px bg-[#301B6914] mt-6 mb-3" />
                        {/* Pagination */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                    {t("prev")}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                    {t("next")}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#8A97AB] text-sm">Page 1 of 100</span>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="females">
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                            <IdCard isFav={false} name='فاطمة' avatar='/icons/female-img.png' age={24} city="جدة" job="engineer" marriageType="misyarMarriage" skinColor="mediumSkin" status="single" />
                            <IdCard isFav={true} name='عائشة' avatar='/icons/female-img.png' age={26} city="مكة" job="lawyer" marriageType="temporaryMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={true} name='خديجة' avatar='/icons/female-img.png' age={22} city="الطائف" job="student" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={true} name='خديجة' avatar='/icons/female-img.png' age={22} city="الطائف" job="student" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                            <IdCard isFav={true} name='خديجة' avatar='/icons/female-img.png' age={22} city="الطائف" job="student" marriageType="normalMarriage" skinColor="lightSkin" status="single" />
                        </div>
                        <div className="h-px bg-[#301B6914] mt-6 mb-3" />
                        {/* Pagination */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                    {t("prev")}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
                                    {t("next")}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#8A97AB] text-sm">Page 1 of 100</span>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default NewSubscribers;