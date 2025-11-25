"use client";

import React, { useMemo, useEffect, useState } from "react";
import IdCard from "@/components/shared/IdCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Select from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { useTranslations, useLocale } from "next-intl";
import api from "@/lib/axiosClient";
import Cookies from "js-cookie";
import countriesData from "@/lib/countries.json";
import citiesData from "@/lib/cities.json";

const genderTabs = [
    { value: "all", labelKey: "all" },
    { value: "male", labelKey: "males" },
    { value: "female", labelKey: "females" },
];

const PAGE_SIZE = 9;

const NewSubscribers = React.memo(() => {
    const t = useTranslations("filters");
    const tEdit = useTranslations("profileEdit");
    const locale = useLocale();
    const currentLocale = locale === "ar" ? "ar" : "en";

    // Filters and pagination state
    const [gender, setGender] = useState<string | undefined>(undefined);
    const [country, setCountry] = useState<string | undefined>(undefined); // ISO2
    const [placeOfResidence, setPlaceOfResidence] = useState<string | undefined>(undefined); // free text
    const [marriageType, setMarriageType] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);

    // Data state
    const [users, setUsers] = useState<any[]>([]);
    const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);

    // Build nationality options from countries.json
    const nationalityOptions = useMemo(() => {
        return countriesData.map((c: any) => ({
            value: c.code,
            label: currentLocale === "ar" ? c.ar : c.en
        }));
    }, [currentLocale]);

    // Build placeOfResidence options from cities.json
    const placeOfResidenceOptions = useMemo(() => {
        return citiesData.map((city: any) => ({
            value: city.code,
            label: currentLocale === "ar" ? city.ar : city.en
        }));
    }, [currentLocale]);

    function getNationalityLabel(code: string, locale: string) {
  const item = countriesData.find((c: any) => c.code === code);
  return item ? (locale === "ar" ? item.ar : item.en) : code;
}

function getPlaceOfResidenceLabel(code: string, locale: string) {
  const item = citiesData.find((city: any) => city.code === code);
  return item ? (locale === "ar" ? item.ar ?? item.en : item.en) : code;
}

    // Fetch users from API
    useEffect(() => {
        setLoading(true);
        const params: Record<string, any> = {
            page,
            limit: PAGE_SIZE,
        };
        if (gender && gender !== "all") params.gender = gender;
        
        // Send country as ISO2 code (or convert to English name if backend expects it)
        if (country) {
            // Option 1: Send ISO2 directly
            params.country = country;
            // Option 2: Convert to English name if backend expects country name
            // const countryNameEn = countriesLib.getName(country, "en", { select: "official" }) || country;
            // params.country = countryNameEn;
        }
        
        if (placeOfResidence) params.city = placeOfResidence; // Send as city param
        if (marriageType) params.marriageType = marriageType;

        const token = Cookies.get("access_token");

        api
            .get("/users/latest", {
                params,
                headers: { skipAuth: true }
            })
            .then((res) => {
                setUsers(res.data.data);
                // setPagination(res.data.data.pagination);
            })
            .catch(() => {
                setUsers([]);
                setPagination({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
            })
            .finally(() => setLoading(false));
    }, [gender, country, placeOfResidence, marriageType, page]);

    // Handle tab change
    const handleTabChange = (tab: string) => {
        setGender(tab === "all" ? undefined : tab);
        setPage(1);
    };

    // Handle filter change
    const handleCountryChange = (val: string) => {
        setCountry(val);
        setPage(1);
    };

    const handlePlaceOfResidenceChange = (val: string) => {
        setPlaceOfResidence(val);
        setPage(1);
    };

    const handleMarriageTypeChange = (val: string) => {
        setMarriageType(val);
        setPage(1);
    };

    return (
        <section
            className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px]"
            style={{
                background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)",
            }}
        >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center mb-8">
                {t("newMembersTitle")}
            </h2>

            <div className="max-w-5xl mx-auto">
                <Tabs value={gender ?? "all"} onValueChange={handleTabChange}>
                    <TabsList className="w-full my-10 md:mb-6 md:mt-0 flex gap-4 items-center justify-center flex-col-reverse md:flex-row">
                        <div className="flex gap-1 items-center">
                            {genderTabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="!rounded-[15px]">
                                    {t(tab.labelKey)}
                                </TabsTrigger>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Nationality Select */}
                            <FormField required>
                                <Select
                                    className="bg-white/40"
                                    options={nationalityOptions}
                                    placeholder={t("nationality")}
                                    value={country}
                                    onChange={handleCountryChange}
                                />
                            </FormField>
                            {/* Place of Residence Select */}
                            <FormField required>
                                <Select
                                    className="bg-white/40"
                                    options={placeOfResidenceOptions}
                                    placeholder={t("placeOfResidence")}
                                    value={placeOfResidence}
                                    onChange={handlePlaceOfResidenceChange}
                                />
                            </FormField>
                            
                            <FormField required>
                                <Select
                                    className="bg-white/40"
                                    options={[
                                        { value: "traditional", label: tEdit("traditional") },
                                        { value: "mesyar", label: tEdit("civil") }
                                      ]}
                                    placeholder={t("marriageType")}
                                    value={marriageType}
                                    onChange={(val) => handleMarriageTypeChange(val)}
                                />
                            </FormField>
                        </div>
                    </TabsList>

                    <TabsContent value={gender ?? "all"}>
                        {loading ? (
                            <div className="text-center py-12 text-lg text-[#301B69]">{t("loading")}</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {users.length === 0 ? (
                                        <div className="col-span-full text-center text-[#301B69] py-8">
                                            {t("noResults")}
                                        </div>
                                    ) : (
                                        users.map((user) => (
                                            <IdCard
                                                key={user.id}
                                                id={user?.id}
                                                isFav={user?.hasLiked}
                                                name={user?.fullName}
                                                avatar={user?.gender === "female" || user?.gender === "أنثى" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                                                age={user?.age}
                                                placeOfResidence={getPlaceOfResidenceLabel(user?.placeOfResidence, currentLocale)}
                                                nationality={getNationalityLabel(user?.nationality, currentLocale)}
                                                job={user?.natureOfWork}
                                                marriageType={user?.marriageType}
                                                skinColor={user?.bodyColor}
                                                status={user?.maritalStatus}
                                            />
                                        ))
                                    )}
                                </div>
                                <div className="h-px bg-[#301B6914] mt-6 mb-3" />
                                <Pagination
                                    t={t}
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={setPage}
                                />
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
});

function Pagination({
    t,
    page,
    totalPages,
    onPageChange,
}: {
    t: (key: string, values?: Record<string, any>) => string;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    {t("prev")}
                </button>
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                >
                    {t("next")}
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[#8A97AB] text-sm">
                    {t("pageInfo", { page, totalPages })}
                </span>
            </div>
        </div>
    );
}

export default NewSubscribers;