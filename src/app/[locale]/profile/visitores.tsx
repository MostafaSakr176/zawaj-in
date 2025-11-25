"use client"
import IdCard from '@/components/shared/IdCard';
import api from '@/lib/axiosClient';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect } from 'react'
import countriesData from "@/lib/countries.json";
import citiesData from "@/lib/cities.json";

const Visitores = ({ setTotalVisits }: { setTotalVisits: React.Dispatch<React.SetStateAction<number>> }) => {

    const [visitores, setVisitores] = React.useState<any[]>([]);
    const tProfile = useTranslations("profile");
function getNationalityLabel(code: string, locale: string) {
  const item = countriesData.find((c: any) => c.code === code);
  return item ? (locale === "ar" ? item.ar : item.en) : code;
}

function getPlaceOfResidenceLabel(code: string, locale: string) {
  const item = citiesData.find((city: any) => city.code === code);
  return item ? (locale === "ar" ? item.ar ?? item.en : item.en) : code;
}

const locale = useLocale();
const currentLocale = locale === "ar" ? "ar" : "en";


    useEffect(() => {
        setTotalVisits(0);

        api.get("/users/profile/visitors")
            .then(res => {
                if (res.data?.success && res.data?.data?.total !== undefined) {
                    setVisitores(res.data.data.visitors)
                }
            });

        api.post("/users/profile/visitors/mark-all-seen")
            .then(res => {
                if (res.data?.success && res.data?.data?.total !== undefined) {
                    setVisitores(res.data.data.visitors)
                }
            });

    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {visitores.length === 0 ? (
                <div className="col-span-full text-center text-[#301B69] py-8">
                    {tProfile("noVisitores")}
                </div>
            ) : (
                visitores.map((user: any) => (
                    <IdCard
                        key={user.id}
                        id={user.id}
                        isFav={user?.hasLiked}
                        name={user.fullName || "User"}
                        avatar={user.gender === "female" || user.gender === "أنثى" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                        age={user.age}
                        placeOfResidence={getPlaceOfResidenceLabel(user?.placeOfResidence, currentLocale)}
                        nationality={getNationalityLabel(user?.nationality, currentLocale)}
                        job={user?.natureOfWork}
                        marriageType={user?.marriageType}
                        skinColor={user?.bodyColor}
                        status={user?.maritalStatus}
                        online={user?.isOnline} // This will now show real-time status
                    />
                ))
            )}

        </div>
    )
}

export default Visitores