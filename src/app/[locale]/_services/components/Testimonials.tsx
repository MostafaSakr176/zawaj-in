"use client"
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const Testimonials = () => {
  const t = useTranslations("userOpinionSection");
  const locale = useLocale()
  return (
    <div className='px-4 md:px-0'>
      <div className='w-full py-10 lg:py-16 md:max-w-[95%] mx-auto rounded-3xl md:rounded-[48px] mt-12 md:mt-20'
        style={{
          background: "linear-gradient(124.5deg, #E3EBFF 8.9%, #EFFFED 140.17%)"
        }}
      >
        <div className='flex flex-col items-center text-center gap-4 mb-10 max-w-3xl mx-auto px-4 '>
          <span className="mx-auto text-[#301B69] text-sm font-semibold px-3 py-1 rounded-full border-2 border-white flex items-center gap-2"
            style={{ background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)" }}>
            {t(`badge`)}
            <Image src="/icons/Testimonials/star.svg" alt="Most Popular" width={16} height={16} />
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg font-medium text-[#301B69] text-center mb-10">
            {t("subtitle")}
          </p>
        </div>

        <div className='px-4 md:px-8'>
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
            {[...Array(10)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-[24px] border border-[#E3EBFF] p-6 max-w-md mx-auto flex flex-col gap-4"
                  style={{
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.64) 40%, rgba(255, 255, 255, 0.3072) 100%)",
                    boxShadow: "0px 0px 0px 6px #CC81B10A",
                    backdropFilter: "blur(20px)",
                    border: "1px solid #301B6929"
                  }}>
                  {/* Stars */}
                  <div className="flex justify-start gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#301B69">
                        <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  {/* Testimonial Text */}
                  <p className="text-[#301B69] text-lg">
                    "موقع زواج إن غير حياتي. تعرفت على زوجتي بعد شهرين فقط من التسجيل، واليوم نحن نعيش حياة سعيدة ومستقرة. ."
                  </p>
                  {/* User Info */}
                  <div className="flex items-center justify-start gap-2 mt-2">
                    <Image
                      src="/icons/Testimonials/user.png"
                      alt="أحمد"
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-white"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-[#301B69] font-bold text-base">أحمد</span>
                      <span className="text-[#301B69] text-sm">القاهرة</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            dir={locale === "en" ? "rtl" : "ltr"}
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
            centeredSlides={false}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {[...Array(10)].map((_, i) => (
              <SwiperSlide key={i}>
                <div
                  dir={locale === "en" ? "ltr" : "rtl"}
                  className="rounded-[24px] shadow-md border border-[#E3EBFF] p-6 max-w-md mx-auto flex flex-col gap-4 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.64) 40%, rgba(255, 255, 255, 0.3072) 100%)",
                    boxShadow: "0px 0px 0px 6px #CC81B10A",
                    backdropFilter: "blur(20px)",
                    border: "1px solid #301B6929"
                  }}>
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#301B69">
                        <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  {/* Testimonial Text */}
                  <p className="text-[#301B69] text-lg">
                    "موقع زواج إن غير حياتي. تعرفت على زوجتي بعد شهرين فقط من التسجيل، واليوم نحن نعيش حياة سعيدة ومستقرة. ."
                  </p>
                  {/* User Info */}
                  <div className="flex items-center gap-2 mt-2 ">
                    <Image
                      src="/icons/Testimonials/user.png"
                      alt="أحمد"
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-white"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-[#301B69] font-bold text-base">أحمد</span>
                      <span className="text-[#301B69] text-sm">القاهرة</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default Testimonials