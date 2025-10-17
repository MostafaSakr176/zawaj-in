"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Label from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import api from "@/lib/axiosClient";

type FieldProps = { label: string; value: string | number | null | undefined };


const Profile = () => {
  const { profile } = useAuth();
  const tProfile = useTranslations("profile");
  const tPartner = useTranslations("partnerProfile");
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(!!profile?.isActive);

  useEffect(() => {
    api.get("/users/profile/visitors")
      .then(res => {
        if (res.data?.success && res.data?.data?.total !== undefined) {
          setTotalVisits(res.data.data.total);
        }
      });
  }, []);

  // Sync isOnline state with profile when profile changes
  useEffect(() => {
    setIsOnline(!!profile?.isActive);
  }, [profile?.isActive]);

  const handleOnlineToggle = (checked: boolean) => {
    setIsOnline(checked);
    api.post("/users/status", { isOnline: checked }).catch(() => { });
  };

  const Field = ({ label, value }: FieldProps) => (
    <div className="flex flex-col gap-1 px-3">
      <span className="text-base text-[#727272]">{label}</span>
      <span className="text-[#301B69]">{value !== null && value !== undefined ? value : tPartner("notSpecified")}</span>
    </div>
  );

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="w-screen h-screen bg-white text-center fixed top-0 left-0 z-[999999] flex items-center justify-center">
          <div className='w-full h-full flex items-center justify-center'
            style={{
              backgroundImage: "url('/photos/footer-bg.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
            <div className="w-0 h-[15rem] flex items-center justify-center transform rotate-30 overflow-hidden animate-[expand_2s_ease-out_forwards]">
              <div className="text-6xl font-bold transform -rotate-30 text-nowrap">
                <span className="text-[#301B69]">زواج</span>{" "}
                <span className="text-[#E30BCD]">إن</span>
              </div>
            </div>
          </div>
        </div>      
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff] space-y-4'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

        <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 md:px-3 flex-col md:flex-row">
            {/* Profile summary (right in RTL) */}
            <div className='w-full md:w-auto flex items-center justify-between gap-6'>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={profile.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.webp"}
                    alt="avatar"
                    width={72}
                    height={72}
                    className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ring-4 ring-white shadow"
                  />
                  {isOnline && (
                    <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-[#28C76F] ring-2 ring-white" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-end gap-1">
                      <h4 className="text-xl md:text-2xl font-semibold text-[#301B69] leading-none">
                        {profile.fullName}
                      </h4>
                      {profile.isVerified && <Image src={"/icons/virify.webp"} alt="virify" width={16} height={16} />}
                    </div>
                  </div>
                  <div className="text-[#8A97AB] text-sm md:text-base">
                    {tPartner("membershipNumber")} {profile.chartNumber}
                  </div>
                </div>
              </div>
              <div className="flex md:hidden items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={isOnline}
                  onCheckedChange={handleOnlineToggle}
                />
                <Label htmlFor="airplane-mode" className='mb-0'>{tProfile("online")}</Label>
              </div>
            </div>

            {/* Actions (left in RTL) */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={isOnline}
                  onCheckedChange={handleOnlineToggle}
                />
                <Label htmlFor="airplane-mode" className='mb-0'>{tProfile("online")}</Label>
              </div>
              <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                <Image src="/icons/foots.webp" alt="favorite" width={24} height={24} />
                {tProfile("whoVisitedMe")}
                <span className='text-lg w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center leading-1'>
                  {totalVisits}
                </span>
              </button>
              <Link href="/profile/edit">
                <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                  <Image src="/icons/edit-user.webp" alt="favorite" width={24} height={24} />
                  {tProfile("editProfile")}
                </button>
              </Link>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Bio Section */}
          {profile.bio && (
            <>
              <div className="px-2 md:px-4">
                <h4 className="text-[#2D1F55] font-semibold text-base mb-4">{tPartner("bioTitle")}</h4>
                <p className="text-[#301B69] leading-relaxed">{profile.bio}</p>
              </div>
              <hr className="border-[#ECEBFF]" />
            </>
          )}

          {/* Section: السكن و الحالة الإجتماعية */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">{tPartner("sectionResidence")}</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("country")} value={profile?.location?.country} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("city")} value={profile?.location?.city} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("age")} value={`${profile.age} ${tPartner("years")}`} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("origin")} value={profile.origin} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("nationality")} value={profile.nationality} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("placeOfResidence")} value={profile.placeOfResidence} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("tribe")} value={profile.tribe} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("numberOfChildren")} value={profile.numberOfChildren} />
              </div>
              <div>
                <Field label={tPartner("maritalStatus")} value={profile.maritalStatus} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">{tPartner("sectionAppearance")}</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("skinColor")} value={profile?.bodyColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("height")} value={profile?.height} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("weight")} value={profile?.weight} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("hairColor")} value={profile?.hairColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("eyeColor")} value={profile?.eyeColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("hairType")} value={profile?.hairType} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("skinColor")} value={profile.skinColor} />
              </div>
              <div >
                <Field label={tPartner("beauty")} value={profile.beauty} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Section: الدراسة و العمل */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">{tPartner("sectionEducation")}</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("education")} value={profile.profession} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("job")} value={profile.natureOfWork} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("educationLevel")} value={profile.educationLevel} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("financialStatus")} value={profile.financialStatus} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("healthStatus")} value={profile.healthStatus} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Section: الديانة والممارسة */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">{tPartner("sectionReligion")}</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("sect")} value={profile.sect} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("religiousPractice")} value={profile.religiousPractice} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("prayerLevel")} value={profile.prayerLevel} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("marriageType")} value={profile.marriageType} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("religiosityLevel")} value={profile.religiosityLevel} />
              </div>
              <div>
                <Field label={tPartner("acceptPolygamy")} value={profile.acceptPolygamy ? tPartner("yes") : tPartner("no")} />
              </div>
            </div>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
          <h3 className='font-semibold text-3xl text-[#301B69]'>{tPartner("partnerPreferencesTitle")}</h3>

          <div className="px-2 md:px-4">
            <div className="flex items-center flex-wrap gap-4">
              <div className="">
                <Field label={tPartner("partnerBio")} value={profile.partnerPreferencesBio} />
              </div>
            </div>
          </div>


          {/* Section: الدراسة و العمل */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">{tPartner("sectionAppearance")}</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("skinColor")} value={profile?.preferredBodyColors?.join(", ")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("height")} value={`${profile?.preferredMinHeight} - ${profile?.preferredMaxHeight} ${tPartner("cm")}`} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("weight")} value={`${profile?.preferredMinWeight} - ${profile?.preferredMaxWeight} ${tPartner("kg")}`} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("hairColor")} value={profile?.preferredHairColors?.join(", ")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("eyeColor")} value={profile?.preferredEyeColors?.join(", ")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredNationality")} value={profile.preferredNationality} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredResidencePlace")} value={profile.preferredResidencePlace} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredEducationLevel")} value={profile.preferredEducationLevel} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredWorkNature")} value={profile.preferredWorkNature} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredMaritalStatus")} value={profile.preferredMaritalStatus} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredFinancialStatus")} value={profile.preferredFinancialStatus} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredHasHouse")} value={profile.preferredHasHouse ? tPartner("yes") : tPartner("no")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredHealthStatus")} value={profile.preferredHealthStatus} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredBeauty")} value={profile.preferredBeauty} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredSkinColor")} value={profile.preferredSkinColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredReligiosityLevel")} value={profile.preferredReligiosityLevel} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label={tPartner("preferredAcceptPolygamy")} value={profile.preferredAcceptPolygamy} />
              </div>
              <div>
                <Field label={tPartner("preferredMarriageType")} value={profile.preferredMarriageType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Profile