"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Label from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import api from "@/lib/axiosClient";
import IdCard from '@/components/shared/IdCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type FieldProps = { label: string; value: string | number | null | undefined };


const Profile = () => {
  const { profile } = useAuth();
  const tProfile = useTranslations("profile");
  const tPartner = useTranslations("partnerProfile");
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [visitores, setVisitores] = useState([])
  const [showVisitores, setShowVisitores] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(!!profile?.isActive);

  useEffect(() => {
    api.get("/users/profile/visitors")
      .then(res => {
        if (res.data?.success && res.data?.data?.total !== undefined) {
          setTotalVisits(res.data.data.total);
          setVisitores(res.data.data.visitors)
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
      <div className='relative pt-24 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff] space-y-4'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

        <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 md:px-3 flex-col md:flex-row">
            {/* Profile summary (right in RTL) */}
            <div className='w-full md:w-auto flex items-center justify-between gap-3 md:gap-6'>
              <div className="flex items-center gap-2 md:gap-3">
                {showVisitores && <> <ArrowRight size={30} onClick={() => setShowVisitores(false)} className='ltr:hidden' /> <ArrowLeft size={30} onClick={() => setShowVisitores(false)} className='rtl:hidden' />  </>}
                <div className="relative">
                  <Image
                    src={profile.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                    alt="avatar"
                    width={72}
                    height={72}
                    className="w-12 h-12 md:w-[72px] md:h-[72px] rounded-full ring-4 ring-white shadow"
                  />
                  {isOnline && (
                    <span className="absolute top-0 left-0 md:top-1 md:left-1 w-3 h-3 rounded-full bg-[#28C76F] ring-2 ring-white" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-end gap-1">
                      <h4 className="text-lg md:text-2xl font-semibold text-[#301B69] leading-none">
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
              <button onClick={() => setShowVisitores(true)} className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_9524_16921)">
                    <path d="M13.9117 18.0055C15.2063 18.4488 16.3494 18.7312 17.9919 19.2359C17.3609 27.2088 9.8217 24.0425 13.9117 18.0055ZM20.643 10.6814C20.558 8.28749 20.1363 5.14721 16.7777 5.63927C15.2033 6.05016 14.0399 7.77928 13.4928 10.7626C13.1923 12.4028 13.3671 14.7052 13.7215 16.0854C14.0452 17.058 13.9351 16.9982 14.2829 17.1829C15.6293 17.4862 16.9621 17.8219 18.3194 18.1643C19.6983 17.1906 20.8307 12.0211 20.643 10.6814ZM10.278 10.4977C10.6322 9.11734 10.8069 6.81497 10.5066 5.17487C9.95985 2.19146 8.79639 0.462061 7.22167 0.0514438C3.86302 -0.440608 3.44137 2.69962 3.35635 5.09367C3.16867 6.43312 4.30125 11.6029 5.68023 12.5765C7.03743 12.2341 8.37008 11.8986 9.71685 11.5951C10.0643 11.4105 9.95421 11.4703 10.278 10.4977ZM6.00732 13.6484C6.63808 21.6211 14.1773 18.4549 10.0874 12.4179C8.79281 12.8613 7.64974 13.1437 6.00732 13.6484Z" fill="black" />
                  </g>
                  <defs>
                    <clipPath id="clip0_9524_16921">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {tProfile("whoVisitedMe")}
                <span className='text-lg w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center leading-1'>
                  {totalVisits}
                </span>
              </button>
              <Link href="/profile/edit">
                <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] text-sm md:text-base px-3 py-2 md:px-4 md:py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C14.0711 15 15.75 13.3211 15.75 11.25C15.75 9.17893 14.0711 7.5 12 7.5C9.92893 7.5 8.25 9.17893 8.25 11.25C8.25 13.3211 9.92893 15 12 15Z" stroke="#301B69" strokeWidth="1.5" strokeMiterlimit="10" />
                    <path d="M5.98145 18.6913C6.54639 17.5806 7.40768 16.6478 8.46997 15.9963C9.53226 15.3448 10.7541 15 12.0003 15C13.2464 15 14.4683 15.3448 15.5306 15.9963C16.5929 16.6478 17.4542 17.5806 18.0191 18.6913" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.75 6.75C19.5784 6.75 20.25 6.07843 20.25 5.25C20.25 4.42157 19.5784 3.75 18.75 3.75C17.9216 3.75 17.25 4.42157 17.25 5.25C17.25 6.07843 17.9216 6.75 18.75 6.75Z" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.75 3.75V2.625" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.4508 4.5L16.4766 3.9375" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.4508 6L16.4766 6.5625" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.75 6.75V7.875" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.0488 6L21.0231 6.5625" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.0488 4.5L21.0231 3.9375" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.9361 10.9219C20.9787 11.2797 21.0001 11.6397 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17294 13.7558C2.82567 12.01 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3C12.2816 3 12.56 3.01275 12.8352 3.03824" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {tProfile("editProfile")}
                </button>
              </Link>
            </div>
          </div>

          <hr className="border-[#ECEBFF]" />

          {!showVisitores ?
            <>
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
                    <Field label={tPartner("nationality")} value={profile?.location?.country} />
                  </div>
                  <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                    <Field label={tPartner("placeOfResidence")} value={profile?.location?.city} />
                  </div>
                  <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                    <Field label={tPartner("age")} value={`${profile.age} ${tPartner("years")}`} />
                  </div>
                  <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                    <Field label={tPartner("tribe")} value={profile.tribe} />
                  </div>
                  <div>
                    <Field label={tPartner("maritalStatus")} value={profile.maritalStatus} />
                  </div>
                  <div>
                    <Field label={tPartner("home")} value={profile.houseAvailable ? tPartner("yes") : tPartner("no")} />
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
                    <Field label={tPartner("height")} value={profile?.height} />
                  </div>
                  <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                    <Field label={tPartner("weight")} value={profile?.weight} />
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
                    <Field label={tPartner("job")} value={profile.natureOfWork} />
                  </div>
                  <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
                    <Field label={tPartner("educationLevel")} value={profile.educationLevel} />
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
                    <Field label={tPartner("marriageType")} value={profile.marriageType} />
                  </div>
                </div>
              </div>
            </> :
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
                    avatar={user.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                    age={user.age}
                    city={user?.location?.city}
                    job={user?.natureOfWork}
                    marriageType={user?.marriageType}
                    skinColor={user?.bodyColor}
                    status={user?.maritalStatus}
                    online={user?.isOnline} // This will now show real-time status
                  />
                ))
              )}

            </div>
          }
        </div>


      </div>
    </ProtectedRoute>
  )
}

export default Profile