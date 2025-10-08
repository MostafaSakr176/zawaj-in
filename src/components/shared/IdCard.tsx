"use client";

import Image from "next/image";
import { Heart, BadgeCheck, MapPin, Palette, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import api from "@/lib/axiosClient";

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

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string | null }) => (
    <div className="flex items-center justify-start gap-1">
        <span className="text-[#E30BCD]">{icon}</span>
        <span className="text-sm text-[#8A97AB]">{text || "غير محدد"}</span>
    </div>
);

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
                            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#2DC653] ring-3 ring-white" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-end gap-1">
                            <h4 className="text-base font-semibold text-[#301B69] leading-none">
                                {name}
                            </h4>
                            {verified && <Image src={"/icons/virify.svg"} alt="virify" width={16} height={16} />}
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
                        <Image src="/icons/heart-fill.svg" alt="favorite" width={32} height={32} />
                    ) : (
                        <Image src="/icons/heart.svg" alt="favorite" width={32} height={32} />
                    )}
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#301B6914] my-4" />

            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-x-1 gap-y-3">
                <InfoItem icon={<MapPin size={16} />} text={city} />
                <InfoItem icon={<BadgeCheck size={16} />} text={status} />
                <InfoItem icon={<BadgeCheck size={16} />} text={job} />
                <InfoItem icon={<Palette size={16} />} text={skinColor} />
                <InfoItem icon={<HeartHandshake size={16} />} text={marriageType} />
            </div>
        </div>
    );
};

export default IdCard;