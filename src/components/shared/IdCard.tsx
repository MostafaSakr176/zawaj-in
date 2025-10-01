"use client";

import Image from "next/image";
import { Heart, BadgeCheck, MapPin, Palette, HeartHandshake } from "lucide-react";

type IdCardProps = {
    name: string;
    age: number;
    city: string;
    status: string;
    job: string;
    skinColor: string;
    marriageType: string;
    avatar: string;
    verified?: boolean;
    online?: boolean;
    isFav?: boolean;
};

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center justify-start gap-1">
        <span className="text-[#E30BCD]">{icon}</span>
        <span className="text-sm text-[#8A97AB]">{text}</span>
    </div>
);

const IdCard = ({
    name = "سامية",
    age = 32,
    city = "جدة",
    status = "عزب",
    job = "معلم",
    skinColor = "لون البشرة أبيض",
    marriageType = "الزواج مسيار",
    avatar = "/photos/avatar-female.png",
    isFav = false,
    verified = true,
    online = true,
}: IdCardProps) => {
    return (
        <div className="rounded-xl border border-[#301B6929] bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(48,27,105,0.06)] p-4">
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
                    className="bg-transparent border-none cursor-pointer focus:outline-none"
                >
                    {isFav ? <Image src="/icons/heart-fill.svg" alt="favorite" width={32} height={32} /> : <Image src="/icons/heart.svg" alt="favorite" width={32} height={32} />}
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