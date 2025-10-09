"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Label from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';

type FieldProps = { label: string; value: string | number | null | undefined };
const Field = ({ label, value }: FieldProps) => (
  <div className="flex flex-col gap-1 px-3">
    <span className="text-base text-[#727272]">{label}</span>
    <span className="text-[#301B69]">{value !== null && value !== undefined ? value : 'غير محدد'}</span>
  </div>
);

const Profile = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12 text-lg text-[#301B69]">جاري تحميل البيانات...</div>
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
                  {profile.isActive && (
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
                  <div className="text-[#8A97AB] text-sm md:text-base">رقم العضوية {profile.chartNumber}</div>
                </div>
              </div>
              <div className="flex md:hidden items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode" className='mb-0'>متصل</Label>
              </div>
            </div>

            {/* Actions (left in RTL) */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode" className='mb-0'>متصل</Label>
              </div>
              <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                <Image src="/icons/foots.webp" alt="favorite" width={24} height={24} />
                من زار بياناتي
                <span className='text-lg w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center leading-1'>5</span>
              </button>
              <Link href="/profile/edit">
                <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                  <Image src="/icons/edit-user.webp" alt="favorite" width={24} height={24} />
                  تعديل بياناتي
                </button>
              </Link>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Bio Section */}
          {profile.bio && (
            <>
              <div className="px-2 md:px-4">
                <h4 className="text-[#2D1F55] font-semibold text-base mb-4">نبذة شخصية</h4>
                <p className="text-[#301B69] leading-relaxed">{profile.bio}</p>
              </div>
              <hr className="border-[#ECEBFF]" />
            </>
          )}

          {/* Section: السكن و الحالة الإجتماعية */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">السكن و الحالة الإجتماعية</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="البلد" value={profile?.location?.country} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="مكان الإقامة" value={profile?.location?.city} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="العمر" value={`${profile.age} سنة`} />
              </div>
              <div>
                <Field label="الحالة العائلية" value={profile.maritalStatus} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Section: الدراسة و العمل */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون البشرة" value={profile?.bodyColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الطول" value={profile?.height} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الوزن" value={profile?.weight} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون الشعر" value={profile?.hairColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون العينين" value={profile?.eyeColor} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="نوع الشعر" value={profile?.hairType} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Section: الدراسة و العمل */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">الدراسة و العمل</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="المؤهل الدراسي" value={profile.profession} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الوظيفة" value={profile.natureOfWork} />
              </div>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {/* Section: الديانة والممارسة */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">الديانة والممارسة</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="المذهب" value={profile.sect} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الممارسة الدينية" value={profile.religiousPractice} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="مستوى الصلاة" value={profile.prayerLevel} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="نوع الزواج" value={profile.marriageType} />
              </div>
              <div>
                <Field label="اقبل التعدد؟" value={profile.acceptPolygamy ? "نعم" : "لا"} />
              </div>
            </div>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
          <h3 className='font-semibold text-3xl text-[#301B69]'>مواصفات شريك حياتي</h3>

          <div className="px-2 md:px-4">
            <div className="flex items-center flex-wrap gap-4">
              <div className="">
                <Field label="شريكة حياتي" value={profile.partnerPreferencesBio} />
              </div>
            </div>
          </div>


          {/* Section: الدراسة و العمل */}
          <div className="px-2 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون البشرة" value={profile?.preferredBodyColors?.join(", ")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الطول" value={`${profile?.preferredMinHeight} - ${profile?.preferredMaxHeight} سم`} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="الوزن" value={`${profile?.preferredMinWeight} - ${profile?.preferredMaxWeight} كغ`} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون الشعر" value={profile?.preferredHairColors?.join(", ")} />
              </div>
              <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                <Field label="لون العينين" value={profile?.preferredEyeColors?.join(", ")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Profile