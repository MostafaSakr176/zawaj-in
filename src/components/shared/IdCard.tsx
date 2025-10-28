"use client";

import Image from "next/image";
import { Heart, BadgeCheck, MapPin, Palette, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import api from "@/lib/axiosClient";
import { useTranslations } from "next-intl";

type IdCardProps = {
    id: string;
    name: string;
    age: number | string;
    city: string;
    status: string;
    job: string | null;
    skinColor: string | null;
    marriageType: string | null;
    avatar: string;
    verified?: boolean;
    online?: boolean;
    isFav?: boolean;
};

const IdCard = ({
    id,
    name,
    age,
    city,
    status,
    job,
    skinColor,
    marriageType,
    avatar,
    isFav,
    verified,
    online,
}: IdCardProps) => {
    const [Fav, setIsFav] = useState(isFav);
    const [loading, setLoading] = useState(false);
    const tPartner = useTranslations("partnerProfile");

    const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string | null }) => (
    <div className="flex items-center justify-start gap-1">
        <span className="text-[#E30BCD]">{icon}</span>
        <span className="text-sm text-[#8A97AB]">{text || tPartner('notSpecified')}</span>
    </div>
);

    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
            if (!Fav) {
                await api.post(`/users/${id}/like`);
                setIsFav(true);
            } else {
                await api.delete(`/users/${id}/like`);
                setIsFav(false);
            }
        } catch (err) {
            // Optionally handle error (show toast, etc.)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative rounded-xl border border-[#301B6929] bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(48,27,105,0.06)] p-4">
            <Link href={`/partner-profile/${id}`} className="w-full h-full absolute inset-0 z-1" />
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Image
                            src={avatar}
                            alt={name}
                            width={42}
                            height={42}
                            className="rounded-full"
                        />
                        {online && (
                            <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-[#2DC653] ring-3 ring-white" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-end gap-1">
                            <h4 className="text-base font-semibold text-[#301B69] leading-none">
                                {name}
                            </h4>
                            {verified && <Image src={"/icons/virify.webp"} alt="virify" width={16} height={16} />}
                        </div>
                        <div className="text-[#301B69] text-sm font-semibold mt-1">{age} سنة</div>
                    </div>
                </div>
                {/* Favorite */}
                <button
                    aria-label="favorite"
                    className="bg-transparent border-none cursor-pointer focus:outline-none relative z-2"
                    onClick={handleLikeToggle}
                    disabled={loading}
                >
                    {Fav ? (
                        <Image src="/icons/heart-fill.webp" alt="favorite" width={32} height={32} />
                    ) : (
                        <Image src="/icons/heart.webp" alt="favorite" width={32} height={32} />
                    )}
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#301B6914] my-4" />

            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-x-1 gap-y-3">
                <InfoItem icon={<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.33298 3.58927C9.01982 3.27695 8.59555 3.10156 8.15323 3.10156C7.71091 3.10156 7.28664 3.27695 6.97348 3.58927C6.66059 3.27731 6.23657 3.10239 5.79468 3.103C5.3528 3.10361 4.92926 3.2797 4.61723 3.59252C4.3052 3.90535 4.13025 4.32929 4.13086 4.77108C4.13147 5.21287 4.30759 5.63633 4.62048 5.94829L6.99948 8.30081L9.35898 5.94829C9.66793 5.63177 9.8387 5.20565 9.83383 4.76341C9.82896 4.32117 9.64884 3.89891 9.33298 3.58927Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.3615 9.60156C11.9159 9.84492 12.4205 10.1886 12.85 10.6154C13.245 10.9834 13.4787 11.4926 13.5 12.0321C13.5 13.8322 10.588 16.1002 7 16.1002C3.412 16.1002 0.5 13.8322 0.5 12.0321C0.521337 11.4926 0.754957 10.9834 1.15 10.6154C1.57946 10.1886 2.0841 9.84492 2.6385 9.60156" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.1983 5.95889C12.1983 8.94829 6.99835 14.1472 6.99835 14.1472C6.99835 14.1472 1.79835 8.94829 1.79835 5.95889C1.76518 4.54594 2.2941 3.17756 3.26901 2.15411C4.24393 1.13066 5.58517 0.535762 6.99835 0.5C8.41152 0.535762 9.75276 1.13066 10.7277 2.15411C11.7026 3.17756 12.2315 4.54594 12.1983 5.95889Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                } text={city} />
                <InfoItem icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.43859 1.94203L8.92567 2.55161C9.12921 2.8057 9.42521 2.9687 9.74875 3.00486L10.5252 3.0912C10.6855 3.10875 10.8407 3.15779 10.982 3.23549C11.1233 3.31318 11.2479 3.41801 11.3486 3.54397C11.4493 3.66992 11.5241 3.81451 11.5688 3.96945C11.6135 4.12439 11.6272 4.28663 11.609 4.44686L11.5227 5.2227C11.4867 5.54643 11.5807 5.87119 11.784 6.1257L12.2717 6.73528C12.3725 6.86088 12.4476 7.00514 12.4927 7.1598C12.5377 7.31446 12.5518 7.47649 12.5341 7.6366C12.5164 7.79671 12.4674 7.95177 12.3897 8.09289C12.312 8.23401 12.2073 8.35844 12.0815 8.45903L11.4719 8.9467C11.3459 9.04731 11.241 9.17181 11.1632 9.31305C11.0855 9.4543 11.0363 9.60951 11.0187 9.76978L10.9323 10.5462C10.9148 10.7065 10.8659 10.8619 10.7882 11.0032C10.7105 11.1446 10.6057 11.2692 10.4798 11.37C10.3538 11.4708 10.2092 11.5456 10.0542 11.5904C9.89923 11.6351 9.73695 11.6488 9.57667 11.6306L8.80025 11.5443C8.47671 11.5085 8.15217 11.6024 7.89784 11.8056L7.28825 12.2939C7.16249 12.3949 7.01802 12.4701 6.86312 12.5151C6.70823 12.5602 6.54596 12.5742 6.38563 12.5564C6.22531 12.5385 6.07009 12.4892 5.92887 12.4112C5.78766 12.3332 5.66324 12.2281 5.56275 12.1019L5.07567 11.4924C4.97506 11.3664 4.85056 11.2615 4.70931 11.1837C4.56807 11.1059 4.41286 11.0568 4.25259 11.0391L3.47617 10.9528C3.15308 10.9166 2.85754 10.7537 2.65436 10.4999C2.45118 10.2461 2.35695 9.92205 2.39234 9.59886L2.47867 8.82245C2.5145 8.4989 2.42051 8.17436 2.21734 7.92003L1.72967 7.31045C1.62854 7.1848 1.55323 7.04041 1.50804 6.88558C1.46285 6.73075 1.44869 6.56852 1.46636 6.4082C1.48403 6.24788 1.53318 6.09263 1.611 5.95135C1.68882 5.81008 1.79377 5.68556 1.91984 5.58495L2.52942 5.0967C2.65536 4.99615 2.76022 4.87175 2.83799 4.73061C2.91577 4.58947 2.96493 4.43437 2.98267 4.2742L3.069 3.5007C3.08613 3.34009 3.13485 3.18446 3.21236 3.04275C3.28987 2.90105 3.39464 2.77607 3.52064 2.67501C3.64664 2.57396 3.79138 2.49881 3.94653 2.45391C4.10168 2.409 4.26417 2.39523 4.42467 2.41336L5.20109 2.4997C5.52471 2.53536 5.84926 2.44117 6.1035 2.23778L6.71309 1.7507C6.83881 1.64964 6.98325 1.5744 7.13813 1.52931C7.293 1.48421 7.45526 1.47015 7.61558 1.48793C7.7759 1.50571 7.93114 1.55497 8.07237 1.6329C8.21361 1.71083 8.33806 1.81588 8.43859 1.94203Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.18367 5.98631C9.52259 7.45631 7.77784 9.11706 7.45876 9.19114C7.13967 9.26522 4.84192 8.53606 4.50359 7.06664C4.42207 6.73175 4.47021 6.37842 4.63834 6.07754C4.80647 5.77666 5.08215 5.55048 5.41009 5.44439C5.65078 5.38874 5.90258 5.40582 6.13355 5.49347C6.36452 5.58112 6.56425 5.7354 6.70742 5.93672C6.74798 5.69309 6.85992 5.46697 7.02909 5.28701C7.19825 5.10705 7.41701 4.98134 7.65767 4.92581C7.99895 4.87709 8.34603 4.95937 8.62912 5.15611C8.91222 5.35284 9.11034 5.64945 9.18367 5.98631Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                } text={status} />
                <InfoItem icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.125 3.75H1.875V11.25H13.125V3.75Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.625 7.5H9.375" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.625 9.375H9.375" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.625 5.625H9.375" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.125 6.08906L10.7812 3.75" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.7812 5.15703L11.9531 4.91797L11.7188 6.09453" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                } text={job} />
                <InfoItem icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_10532_440)">
                        <path d="M6.24219 9.17371C6.62088 9.32463 7.03743 9.35266 7.43292 9.25384C7.82841 9.15502 8.18283 8.93435 8.44602 8.62305" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.32585 11.2051L6.99993 11.7301L5.67402 11.2051C5.35085 11.2051 5.35085 13.1242 5.67402 13.1242L6.99993 12.5992L8.32585 13.1242C8.64902 13.1242 8.64902 11.2051 8.32585 11.2051Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.0722 4.75091C9.92964 5.06632 8.72053 5.04709 7.58855 4.69551C6.45657 4.34394 5.44932 3.67479 4.68647 2.76758C4.68647 2.76758 4.95889 4.54966 3.88672 4.70249" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.2811 4.61475C10.9544 2.04167 9.16182 0.875 6.9994 0.875C4.81773 0.875 3.01232 2.06208 2.70898 4.68533" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.94922 10.4915C9.82977 9.74004 10.4521 8.73104 10.7284 7.6069C10.845 7.70423 10.9913 7.75878 11.1431 7.76148C11.3841 7.72636 11.602 7.59897 11.7508 7.40621C11.8996 7.21344 11.9676 6.9704 11.9406 6.7284C11.9676 6.48604 11.8992 6.24269 11.7499 6.04987C11.6007 5.85704 11.3822 5.72988 11.1408 5.69531C11.094 5.69604 11.0474 5.70211 11.002 5.7134" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.99442 5.71573C2.94983 5.70383 2.90404 5.69698 2.85792 5.69531C2.61696 5.73043 2.39907 5.85782 2.25028 6.05058C2.10149 6.24335 2.03344 6.4864 2.0605 6.7284C2.03344 6.9704 2.10149 7.21344 2.25028 7.40621C2.39907 7.59897 2.61696 7.72636 2.85792 7.76148C3.00987 7.75885 3.1563 7.70406 3.27267 7.60631C3.55149 8.74573 4.18712 9.76622 5.08684 10.5189" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.54102 6.125V6.70833" stroke="#E30BCD" strokeMiterlimit="10" strokeLinecap="round" />
                        <path d="M8.45898 6.125V6.70833" stroke="#E30BCD" strokeMiterlimit="10" strokeLinecap="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_10532_440">
                            <rect width="14" height="14" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                } text={skinColor} />
                <InfoItem icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.11946 5.87891C7.87919 5.87943 7.64448 5.95128 7.44509 6.08535C7.2457 6.21942 7.0906 6.40967 6.99946 6.63199C6.90827 6.40935 6.75292 6.21887 6.55317 6.08477C6.35342 5.95067 6.1183 5.87901 5.87771 5.87891C5.54416 5.90761 5.23383 6.06149 5.00907 6.30961C4.78432 6.55774 4.6618 6.88173 4.66613 7.21649C4.66613 8.68182 6.68854 9.87357 6.99946 9.87357C7.31038 9.87357 9.33279 8.68182 9.33279 7.21649C9.33709 6.88146 9.21432 6.55723 8.9892 6.30906C8.76409 6.06089 8.45333 5.90719 8.11946 5.87891Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.7917 3.20703H3.20833C2.88617 3.20703 2.625 3.4682 2.625 3.79036V11.957C2.625 12.2792 2.88617 12.5404 3.20833 12.5404H10.7917C11.1138 12.5404 11.375 12.2792 11.375 11.957V3.79036C11.375 3.4682 11.1138 3.20703 10.7917 3.20703Z" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.12109 3.2087L9.44093 1.13145C9.52857 1.10226 9.6219 1.0943 9.71323 1.10823C9.80455 1.12216 9.89126 1.15759 9.96622 1.21158C10.0412 1.26558 10.1022 1.33661 10.1444 1.41882C10.1865 1.50103 10.2085 1.59207 10.2086 1.68445V2.04204" stroke="#E30BCD" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                } text={marriageType} />
            </div>
        </div>
    );
};

export default IdCard;