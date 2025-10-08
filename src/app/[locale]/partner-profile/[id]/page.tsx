"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axiosClient';

type FieldProps = { label: string; value: string | number | null | undefined };
const Field = ({ label, value }: FieldProps) => (
    <div className="flex flex-col gap-1 px-3">
        <span className="text-base text-[#727272]">{label}</span>
        <span className="text-[#301B69]">{value !== null && value !== undefined ? value : 'غير محدد'}</span>
    </div>
);

type UserDetails = {
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
    hasLiked: boolean;
};

const PartnerProfile = () => {
    const params = useParams();
    const userId = params?.id as string;
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const res = await api.get(`/users/${userId}`);
                setUser(res.data.data);
                // You can check if user is already liked here
                setIsLiked(res.data.data.hasLiked || false);
            } catch (err) {
                console.error('Failed to fetch user details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleLikeToggle = async () => {
        if (likeLoading || !userId) return;
        setLikeLoading(true);
        try {
            if (!isLiked) {
                await api.post(`/users/${userId}/like`);
                setIsLiked(true);
            } else {
                await api.delete(`/users/${userId}/like`);
                setIsLiked(false);
            }
        } catch (err) {
            console.error('Failed to toggle like:', err);
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="text-center py-12 text-lg text-[#301B69]">جاري تحميل البيانات...</div>
            </ProtectedRoute>
        );
    }

    if (!user) {
        return (
            <ProtectedRoute>
                <div className="text-center py-12 text-lg text-[#301B69]">لم يتم العثور على المستخدم</div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff] space-y-4'
                style={{
                    // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
                }}>
                <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

                <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 px-3">

                        {/* Profile summary (right in RTL) */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src={user.gender === "female" ? "/icons/female-img.png" : "/photos/male-icon.svg"}
                                    alt="avatar"
                                    width={72}
                                    height={72}
                                    className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ring-4 ring-white shadow"
                                />
                                {user.isActive && (
                                    <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#28C76F] ring-2 ring-white" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <h4 className="text-2xl font-semibold text-[#301B69] leading-none">
                                            {user.fullName}
                                        </h4>
                                        {user.isVerified && <Image src={"/icons/virify.svg"} alt="virify" width={16} height={16} />}
                                    </div>
                                    <div className="text-[#8A97AB] text-base mb-1">آخر ظهور منذ 2 ساعات</div>
                                </div>
                                <div className="text-[#8A97AB] text-base">رقم العضوية {user.chartNumber}</div>
                            </div>
                        </div>
                        {/* Actions (left in RTL) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLikeToggle}
                                disabled={likeLoading}
                                className={`flex items-center gap-2 rounded-full border px-5 py-2 font-semibold transition focus:outline-none ${isLiked
                                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'border-[#E9E6FF] bg-[#301B6914] text-[#2D1F55] hover:bg-white'
                                    }`}
                            >
                                {isLiked ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
                                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-red-600' : 'text-[#2D1F55]'}`} />
                            </button>
                            <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-5 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none">
                                ارسال رسالة
                                <MessageCircle className="w-5 h-5 text-[#2D1F55]" />
                            </button>
                        </div>
                    </div>

                    <hr className="border-[#ECEBFF]" />

                    {/* Bio Section */}
                    {user.bio && (
                        <>
                            <div className="px-2 md:px-4">
                                <h4 className="text-[#2D1F55] font-semibold text-base mb-4">نبذة شخصية</h4>
                                <p className="text-[#301B69] leading-relaxed">{user.bio}</p>
                            </div>
                            <hr className="border-[#ECEBFF]" />
                        </>
                    )}

                    {/* Section: السكن و الحالة الإجتماعية */}
                    <div className="px-2 md:px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base">السكن و الحالة الإجتماعية</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="البلد" value={user.location.country} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="مكان الإقامة" value={user.location.city} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="العمر" value={`${user.age} سنة`} />
                            </div>
                            <div>
                                <Field label="الحالة العائلية" value={user.maritalStatus} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#ECEBFF]" />

                    {/* Section: الدراسة و العمل */}
                    <div className="px-2 md:px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون البشرة" value={user?.bodyColor} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الطول" value={user?.height} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الوزن" value={user?.weight} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون الشعر" value={user?.hairColor} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون العينين" value={user?.eyeColor} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="نوع الشعر" value={user?.hairType} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#ECEBFF]" />

                    {/* Section: الدراسة و العمل */}
                    <div className="px-2 md:px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base">الدراسة و العمل</h4>
                        </div>
                        <div className="flex items-center gap-4">

                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="المؤهل الدراسي" value={user.profession} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الوظيفة" value={user.natureOfWork} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#ECEBFF]" />

                    {/* Section: الديانة والممارسة */}
                    <div className="px-2 md:px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base">الديانة والممارسة</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="المذهب" value={user.sect} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الممارسة الدينية" value={user.religiousPractice} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="مستوى الصلاة" value={user.prayerLevel} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="نوع الزواج" value={user.marriageType} />
                            </div>
                            <div>
                                <Field label="اقبل التعدد؟" value={user.acceptPolygamy ? "نعم" : "لا"} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
                    <h3 className='font-semibold text-3xl text-[#301B69]'>مواصفات شريك حياتي</h3>

                    <div className="px-2 md:px-4">
                        <div className="flex items-center gap-4">
                            <div className="">
                                <Field label="شريكة حياتي" value={user.partnerPreferencesBio} />
                            </div>
                        </div>
                    </div>


                    {/* Section: الدراسة و العمل */}
                    <div className="px-2 md:px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون البشرة" value={user?.preferredBodyColors?.join(", ")} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الطول" value={`${user?.preferredMinHeight} - ${user?.preferredMaxHeight} سم`} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="الوزن" value={`${user?.preferredMinWeight} - ${user?.preferredMaxWeight} كغ`} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون الشعر" value={user?.preferredHairColors?.join(", ")} />
                            </div>
                            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                                <Field label="لون العينين" value={user?.preferredEyeColors?.join(", ")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default PartnerProfile