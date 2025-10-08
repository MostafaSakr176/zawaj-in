"use client";
import IdCard from '@/components/shared/IdCard';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axiosClient';
import { useAuth } from '@/context/AuthContext';

type Recommendation = {
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  location: { city: string; country: string };
  origin: string | null;
  bio: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
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
  marriageType: string | null;
  acceptPolygamy: boolean | null;
  compatibilityScore: number;
  scoreBreakdown: {
    ageScore: number;
    locationScore: number;
    religiousScore: number;
    maritalStatusScore: number;
    professionScore: number;
    physicalAttributesScore: number;
    marriageTypeScore: number;
  };
  hasLiked: boolean;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const MyFavorites = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 1,
  });

  const {profile} = useAuth();

  const fetchRecommendations = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/matching/recommendations?gender=${profile?.gender === "male" ? "female" : "male"}&page=${page}&limit=${pagination.limit}&minCompatibilityScore=30`
      );
      setRecommendations(res.data.data || []);
      setPagination(res.data.pagination || { page, limit: pagination.limit, total: 0, totalPages: 1 });
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page ,profile]);

  const handlePrev = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
        <Image
          src="/photos/terms-bg.svg"
          alt="Terms Background"
          width={100}
          height={100}
          className="absolute w-full inset-x-0 top-0 z-1"
        />

        <div
          className="max-w-7xl mx-auto px-4 relative z-2 rounded-3xl p-3 shadow-lg"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 255, 255, 0.256) 100%)',
          }}
        >
          <div
            className="p-2 mb-4 flex items-center justify-between rounded-3xl border border-[#EAECF0]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.24) 100%)"
            }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={"/photos/male-icon.svg"}
                  alt={"avatar"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                {true && (
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#2DC653] ring-3 ring-white" />
                )}
              </div>
              <div>
                <div className="text-[#301B69] text-2xl">اهلا بك</div>
                <div className="flex items-center justify-end gap-1">
                  <h4 className="text-3xl font-semibold text-[#301B69] leading-none">
                    {profile?.fullName || "User"}
                  </h4>
                  {true && <Image src={"/icons/virify.svg"} alt="virify" width={16} height={16} />}
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12 text-lg text-[#301B69]">جاري تحميل التوصيات...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recommendations.length === 0 ? (
                <div className="col-span-full text-center text-[#301B69] py-8">
                  لا توجد توصيات حالياً.
                </div>
              ) : (
                recommendations.map((rec) => (
                  <IdCard
                    key={rec.userId}
                    id={rec.userId}
                    isFav={rec?.hasLiked}
                    name={rec.fullName || "User"}
                    avatar={rec.gender === "female" ? "/icons/female-img.png" : "/photos/male-icon.svg"}
                    age={rec.age}
                    city={rec?.location?.city}
                    job={rec?.natureOfWork}
                    marriageType={rec?.marriageType}
                    skinColor={rec?.bodyColor}
                    status={rec?.maritalStatus}
                  />
                ))
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-[#FFFFFF] text-[#344054] hover:bg-white transition disabled:opacity-50"
                onClick={handlePrev}
                disabled={pagination.page <= 1 || loading}
              >
                Prev
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-[#FFFFFF] text-[#344054] hover:bg-white transition disabled:opacity-50"
                onClick={handleNext}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8A97AB] text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyFavorites;