"use client"
import IdCard from '@/components/shared/IdCard'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import api from '@/lib/axiosClient'
import { useTranslations } from 'next-intl';

type user = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  chartNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  dateOfBirth: string | null;
  age: number;
  location: {
    city: string;
    country: string;
  };
  origin: string | null;
  maritalStatus: string;
  profession: string;
  weight: number | null;
  height: number | null;
  bodyColor: string | null;
  hairColor: string | null;
  hairType: string | null;
  eyeColor: string | null;
  houseAvailable: boolean | null;
  natureOfWork: string | null;
  bio: string;
  preferredMinWeight: number | null;
  preferredMaxWeight: number | null;
  preferredMinHeight: number | null;
  preferredMaxHeight: number | null;
  preferredBodyColors: string[] | null;
  preferredHairColors: string[] | null;
  preferredEyeColors: string[] | null;
  partnerPreferencesBio: string | null;
  marriageType: string | null;
  acceptPolygamy: boolean | null;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  role: string;
  permissions: any;
  isBanned: boolean;
  banType: string | null;
  bannedAt: string | null;
  bannedUntil: string | null;
  bannedReason: string | null;
  bannedBy: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  roleAssignedBy: string | null;
  roleAssignedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Like = {
  id: string;
  likedUser: user;
  createdAt: string;
};

type interest = {
  id: string;
  user: user;
  createdAt: string;
};

const MyFavorites = () => {
  const t = useTranslations("favorites");
  const [likes, setLikes] = useState<Like[]>([]);
  const [interested, setInterested] = useState<interest[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [loadingInterested, setLoadingInterested] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoadingLikes(true);
      try {
        const res = await api.get("/users/likes/sent");
        setLikes(res.data.data?.likes || []);
      } catch {
        setLikes([]);
      } finally {
        setLoadingLikes(false);
      }
    };
    fetchLikes();
  }, []);

  useEffect(() => {
    const fetchInterested = async () => {
      setLoadingInterested(true);
      try {
        const res = await api.get("/users/likes/received");
        setInterested(res.data.data?.likes || []);
      } catch {
        setInterested([]);
      } finally {
        setLoadingInterested(false);
      }
    };
    fetchInterested();
  }, []);

  return (
    <ProtectedRoute>
      <div className='relative pt-26 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

        <div className='max-w-7xl mx-auto px-4 md:px-0 relative z-2'>
          <Tabs defaultValue="favorites">
            <TabsList className='w-fit mb-6'>
              <TabsTrigger value="favorites">{t("tabFavorites")}</TabsTrigger>
              <TabsTrigger value="interested">{t("tabInterested")}</TabsTrigger>
            </TabsList>
            <TabsContent value="favorites">
              {loadingLikes ? (
                <div className="text-center py-12 text-lg text-[#301B69]">{t("loadingFavorites")}</div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {likes.length === 0 ? (
                    <div className="col-span-full text-center text-[#301B69] py-8">
                      {t("emptyFavorites")}
                    </div>
                  ) : (
                    likes?.map((like) => (
                      <IdCard
                        key={like?.likedUser?.id}
                        id={like?.likedUser?.id}
                        isFav={true}
                        name={like?.likedUser?.fullName}
                        avatar={like?.likedUser?.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                        age={like?.likedUser?.age}
                        city={like?.likedUser?.location?.city}
                        job={like?.likedUser?.natureOfWork}
                        marriageType={like?.likedUser?.marriageType}
                        skinColor={like?.likedUser?.bodyColor}
                        status={like?.likedUser?.maritalStatus}
                      />
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="interested">
              {loadingInterested ? (
                <div className="text-center py-12 text-lg text-[#301B69]">{t("loadingInterested")}</div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {interested?.length === 0 ? (
                    <div className="col-span-full text-center text-[#301B69] py-8">
                      لا توجد بيانات حالياً.
                    </div>
                  ) : (
                    interested.map((like) => (
                      <IdCard
                        key={like?.user?.id}
                        id={like?.user?.id}
                        isFav={true}
                        name={like?.user?.fullName}
                        avatar={like?.user?.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                        age={like?.user?.age}
                        city={like?.user?.location?.city}
                        job={like?.user?.natureOfWork}
                        marriageType={like?.user?.marriageType}
                        skinColor={like?.user?.bodyColor}
                        status={like?.user?.maritalStatus}
                      />
                    ))
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default MyFavorites