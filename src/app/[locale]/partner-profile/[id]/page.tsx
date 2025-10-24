"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation';
import api from '@/lib/axiosClient';
import { chatService } from '@/services/chatService';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

type FieldProps = { label: string; value: string | number | null | undefined };
const Field = ({ label, value }: FieldProps) => (
    <div className="flex flex-col gap-1 px-3">
        <span className="text-base text-[#727272]">{label}</span>
        <span className="text-[#301B69]">{value !== null && value !== undefined ? value : 'غير محدد'}</span>
    </div>
);

/**
 * Simple date formatter for ISO strings; returns localized date/time or an empty string when input is falsy.
 * Adjust formatting as needed for your locale or presentation requirements.
 */
const formatDate = (iso?: string | null) => {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString(); // change to toLocaleDateString/toLocaleTimeString or custom formatting if needed
    } catch {
        return iso;
    }
};

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
    age: number | null;
    location: {
        city: string;
        country: string;
    };
    origin: string | null;
    username: string | null;
    nationality: string | null;
    placeOfResidence: string | null;
    tribe: string | null;
    maritalStatus: string | null;
    numberOfChildren: number | null;
    profession: string | null;
    educationLevel: string | null;
    financialStatus: string | null;
    healthStatus: string | null;
    religiosityLevel: string | null;
    weight: string | null;
    height: string | null;
    skinColor: string | null;
    beauty: string | null;
    bodyColor: string | null;
    hairColor: string | null;
    hairType: string | null;
    eyeColor: string | null;
    houseAvailable: boolean | null;
    natureOfWork: string | null;
    bio: string | null;
    preferredAgeFrom: number | null;
    preferredAgeTo: number | null;
    preferredMinWeight: string | null;
    preferredMaxWeight: string | null;
    preferredMinHeight: string | null;
    preferredMaxHeight: string | null;
    preferredNationality: string | null;
    preferredResidencePlace: string | null;
    preferredEducationLevel: string | null;
    preferredWorkNature: string | null;
    preferredMaritalStatus: string | null;
    preferredFinancialStatus: string | null;
    preferredHasHouse: boolean | null;
    preferredHealthStatus: string | null;
    preferredBeauty: string | null;
    preferredSkinColor: string | null;
    preferredReligiosityLevel: string | null;
    preferredAcceptPolygamy: string | null;
    preferredMarriageType: string | null;
    preferredBodyColors: string[] | null;
    preferredHairColors: string[] | null;
    preferredEyeColors: string[] | null;
    partnerPreferencesBio: string | null;
    marriageType: string | null;
    acceptPolygamy: boolean | null;
    polygamyStatus: string | null;
    detailedProfile: string | null;
    religiousPractice: string | null;
    sect: string | null;
    prayerLevel: string | null;
    role: string;
    permissions: any;
    isOnline: boolean;
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
    likedme: boolean;
    isliked: boolean;
    matching: boolean;
    lastSeenAt: string;
};

const PartnerProfile = () => {
    const { profile, isAuthenticated } = useAuth()
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const tPartner = useTranslations("partnerProfile");

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const res = await api.get(`/users/${userId}`);
                setUser(res.data.data);
                setIsLiked(res.data.data.hasLiked || false);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();

        // Post visit on page load
        if (userId) {
            api.post(`/users/${userId}/visit`).catch(() => { });
        }
    }, [userId]);

    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            toast.error(tPartner("pleaseLoginToLike"));
            return;
        }
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
        } finally {
            setLikeLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!isAuthenticated) {
            toast.error(tPartner("pleaseLoginToSendMessage"))
            return
        }
        // if (profile && profile.profileCompletion && profile.profileCompletion.percentage < 80) {
            // toast.error(tPartner("completeProfileToSendMessage"));
            router.push('/profile/edit');
        //     return;
        // }
        if (!userId || chatLoading) return;

        setChatLoading(true);
        try {
            // Try to create a conversation (this will return existing one if it exists)
            const conversation = await chatService.createConversation(userId);

            // Navigate to chats page with the conversation ID
            router.push(`/chats?conversation=${conversation.id}`);
        } catch (error: any) {
            toast.error('Error creating/opening conversation:', error);

            // Better error handling for 403
            if (error.response?.status === 403) {
                const errorMsg = error.response?.data?.message || 'You are not authorized to start a conversation with this user';
                console.error('403 Error Details:', {
                    message: errorMsg,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            } else if (error.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                router.push('/auth/sign-in');
            } else {
                alert('Failed to create conversation. Please try again.');
            }
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return (

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
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12 text-lg text-[#301B69]">{tPartner("notFound")}</div>
        );
    }

    return (

        <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff] space-y-4'
            style={{
                // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
            }}>
            <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

            <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-0 md:px-3">

                    {/* Profile summary (right in RTL) */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={user.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                                alt="avatar"
                                width={72}
                                height={72}
                                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ring-4 ring-white shadow"
                            />
                            {user.isOnline && (
                                <span className="absolute top-0 left-0 md:top-1 md:left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#28C76F] ring-2 ring-white" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-end gap-1">
                                    <h4 className="text-lg md:text-2xl font-semibold text-[#301B69] leading-none">
                                        {user.fullName}
                                    </h4>
                                    {user.isVerified && <Image src={"/icons/virify.webp"} alt="virify" width={16} height={16} />}
                                </div>
                                <div className="text-[#8A97AB] text-sm md:text-base mb-1">{user.lastSeenAt ? `${tPartner("lastSeen")}: ${formatDate(user.lastSeenAt)}` : null}</div>
                            </div>
                            <div className="text-[#8A97AB] text-base">{tPartner("membershipNumber")} {user.chartNumber}</div>
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
                            {isLiked ? tPartner("removeFavorite") : tPartner("addFavorite")}
                            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-red-600' : 'text-[#2D1F55]'}`} />
                        </button>
                        <button
                            onClick={handleSendMessage}
                            // disabled={profile && profile.profileCompletion && profile.profileCompletion.percentage < 80 || chatLoading}
                            className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-5 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            // title={profile && profile.profileCompletion && profile.profileCompletion.percentage < 80 ? "You need to complete your profile first" : ""}
                        >
                            {chatLoading ? tPartner("loadingAction") : tPartner("sendMessage")}
                            <MessageCircle className="w-5 h-5 text-[#2D1F55]" />
                        </button>
                    </div>
                </div>

                <hr className="border-[#ECEBFF]" />
                {/* Bio Section */}
                {user.bio && (
                    <>
                        <div className="px-2 md:px-4">
                            <h4 className="text-[#2D1F55] font-semibold text-base mb-4">{tPartner("bioTitle")}</h4>
                            <p className="text-[#301B69] leading-relaxed">{user.bio}</p>
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
                            <Field label={tPartner("nationality")} value={user?.location?.country} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("placeOfResidence")} value={user?.location?.city} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("age")} value={`${user.age} ${tPartner("years")}`} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("tribe")} value={user.tribe} />
                        </div>
                        <div>
                            <Field label={tPartner("maritalStatus")} value={user.maritalStatus} />
                        </div>
                        <div>
                            <Field label={tPartner("home")} value={user.houseAvailable ? tPartner("yes") : tPartner("no")} />
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
                            <Field label={tPartner("height")} value={user?.height} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("weight")} value={user?.weight} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("skinColor")} value={user.skinColor} />
                        </div>
                        <div >
                            <Field label={tPartner("beauty")} value={user.beauty} />
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
                            <Field label={tPartner("job")} value={user.natureOfWork} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={tPartner("educationLevel")} value={user.educationLevel} />
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
                            <Field label={tPartner("marriageType")} value={user.marriageType} />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
                <h3 className='font-semibold text-3xl text-[#301B69]'>{t("partnerPreferencesTitle")}</h3>

                <div className="px-2 md:px-4">
                    <div className="flex items-center flex-wrap gap-4">
                        <div className="">
                            <Field label={t("partnerBio")} value={user.partnerPreferencesBio} />
                        </div>
                    </div>
                </div>


                <div className="px-2 md:px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[#2D1F55] font-semibold text-base">{t("sectionAppearance")}</h4>
                    </div>
                    <div className="flex items-center flex-wrap gap-4">
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("skinColor")} value={user?.preferredBodyColors?.join(", ")} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("height")} value={`${user?.preferredMinHeight} - ${user?.preferredMaxHeight} ${t("cm")}`} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("weight")} value={`${user?.preferredMinWeight} - ${user?.preferredMaxWeight} ${t("kg")}`} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("hairColor")} value={user?.preferredHairColors?.join(", ")} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("eyeColor")} value={user?.preferredEyeColors?.join(", ")} />
                        </div>
                    </div>
                </div>
                <div className="px-2 md:px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[#2D1F55] font-semibold text-base">{t("sectionEducation")}</h4>
                    </div>
                    <div className="flex items-center flex-wrap gap-4">
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredNationality")} value={user?.preferredNationality} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredResidencePlace")} value={user?.preferredResidencePlace} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredEducationLevel")} value={user?.preferredEducationLevel} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredWorkNature")} value={user?.preferredWorkNature} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredMaritalStatus")} value={user?.preferredMaritalStatus} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredFinancialStatus")} value={user?.preferredFinancialStatus} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredHasHouse")} value={user?.preferredHasHouse ? t("yes") : t("no")} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredHealthStatus")} value={user?.preferredHealthStatus} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredBeauty")} value={user?.preferredBeauty} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredSkinColor")} value={user?.preferredSkinColor} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredReligiosityLevel")} value={user?.preferredReligiosityLevel} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredAcceptPolygamy")} value={user?.preferredAcceptPolygamy} />
                        </div>
                        <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                            <Field label={t("preferredMarriageType")} value={user?.preferredMarriageType} />
                        </div>
                    </div>
                </div>
            </div> */}
        </div>

    )
}

export default PartnerProfile