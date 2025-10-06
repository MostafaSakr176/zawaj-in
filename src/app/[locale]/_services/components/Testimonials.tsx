"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Star } from "lucide-react";

// Memoize static testimonial data outside the component
const TESTIMONIALS = [
  {
    name: "أحمد",
    city: "القاهرة",
    text:
      "موقع زواج إن غير حياتي. تعرفت على زوجتي بعد شهرين فقط من التسجيل، واليوم نحن نعيش حياة سعيدة ومستقرة.",
    avatar: "/icons/Testimonials/user.png",
    rating: 5,
  },
  // ...add more testimonials as needed
];

const TestimonialCard = React.memo(function TestimonialCard({
  name,
  city,
  text,
  avatar,
  rating = 5,
}: {
  name: string;
  city: string;
  text: string;
  avatar: string;
  rating?: number;
}) {
  return (
    <div
      className="bg-white rounded-[24px] border border-[#E3EBFF] p-6 max-w-md mx-auto flex flex-col gap-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.64) 40%, rgba(255, 255, 255, 0.3072) 100%)",
        boxShadow: "0px 0px 0px 6px #CC81B10A",
        backdropFilter: "blur(20px)",
        border: "1px solid #301B6929",
      }}
    >
      {/* Stars */}
      <div className="flex justify-start gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#301B69">
            <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      {/* Testimonial Text */}
      <p className="text-[#301B69] text-base">"{text}"</p>
      {/* User Info */}
      <div className="flex items-center justify-start gap-2 mt-2">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="rounded-full border-2 border-white"
          loading="lazy"
        />
        <div className="flex flex-col items-start">
          <span className="text-[#301B69] font-bold text-base">{name}</span>
          <span className="text-[#301B69] text-sm">{city}</span>
        </div>
      </div>
    </div>
  );
});

const Testimonials = React.memo(function Testimonials() {
  const t = useTranslations("userOpinionSection");
  const locale = useLocale();

  // Memoize testimonials for performance
  const testimonials = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ ...TESTIMONIALS[0], key: i })),
    []
  );

  return (
    <section
      id="userOpinion"
      className="max-w-7xl mx-auto py-10 lg:py-16 rounded-3xl md:rounded-[48px]"
      style={{
        background: "linear-gradient(124.5deg, #E3EBFF 8.9%, #EFFFED 140.17%)",
      }}
    >
      <div className="flex flex-col items-center text-center gap-4 mb-10 max-w-3xl mx-auto px-4">
        <span
          className="mx-auto text-[#301B69] text-sm font-semibold px-3 py-1 rounded-full border-2 border-white flex items-center gap-2"
          style={{
            background:
              "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)",
          }}
        >
          {t("badge")}
          <Star size={16} />
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center">
          {t("title")}
        </h2>
        <p className="text-base md:text-lg font-medium text-[#301B69] text-center mb-10">
          {t("subtitle")}
        </p>
      </div>

      <div className="px-4 md:px-0">
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 4, spaceBetween: 16 },
          }}
          spaceBetween={16}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          loop={true}
          speed={2000}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper mb-4"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.key}>
              <TestimonialCard avatar={item.avatar} name={item.name} city={item.city} text={item.text} rating={item.rating} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
});

export default Testimonials;