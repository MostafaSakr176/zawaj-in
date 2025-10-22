"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

// Memoize static data outside the component for performance
const features = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.6833 9C13.3224 9.0009 12.97 9.10886 12.6706 9.31019C12.3712 9.51153 12.1382 9.79719 12.0013 10.131C11.8641 9.79672 11.6307 9.51073 11.3307 9.30936C11.0307 9.10798 10.6776 9.00031 10.3163 9C9.81526 9.04315 9.34915 9.27426 9.01155 9.64693C8.67395 10.0196 8.48985 10.5062 8.49626 11.009C8.49626 13.21 11.5343 15 12.0013 15C12.4683 15 15.5063 13.21 15.5063 11.009C15.5126 10.5057 15.3281 10.0187 14.9899 9.64597C14.6516 9.27324 14.1848 9.04243 13.6833 9Z" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.5 4.5L5.5 19.5C5.5 20.6046 6.39543 21.5 7.5 21.5H16.5C17.6046 21.5 18.5 20.6046 18.5 19.5V4.5C18.5 3.39543 17.6046 2.5 16.5 2.5H7.5C6.39543 2.5 5.5 3.39543 5.5 4.5Z" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6 5.5H17" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6 18.5H17" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
, titleKey: "registerTitle", descKey: "registerDesc" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.44797 10.562C8.22276 10.2917 6.94294 10.426 5.80052 10.9447C4.6581 11.4634 3.71469 12.3386 3.11184 13.439C2.50898 14.5393 2.27919 15.8055 2.45695 17.0475C2.6347 18.2895 3.2104 19.4404 4.09769 20.3275C4.98498 21.2146 6.13599 21.79 7.37805 21.9675C8.6201 22.1449 9.88622 21.9149 10.9864 21.3118C12.0866 20.7087 12.9616 19.7651 13.4801 18.6225C13.9985 17.48 14.1325 16.2001 13.862 14.975" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.5505 21.8935C15.7757 22.1638 17.0555 22.0295 18.1979 21.5108C19.3404 20.9921 20.2838 20.1169 20.8866 19.0165C21.4895 17.9162 21.7193 16.65 21.5415 15.408C21.3638 14.166 20.788 13.0151 19.9008 12.128C19.0135 11.2409 17.8625 10.6655 16.6204 10.488C15.3783 10.3105 14.1122 10.5406 13.012 11.1437C11.9118 11.7468 11.0368 12.6904 10.5184 13.833C9.9999 14.9755 9.8659 16.2554 10.1365 17.4805" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.2096 1.96875C13.8053 1.96959 13.4103 2.09044 13.0747 2.316C12.7392 2.54156 12.4781 2.86166 12.3246 3.23575C12.1707 2.86119 11.909 2.5408 11.5727 2.31523C11.2363 2.08965 10.8406 1.96906 10.4356 1.96875C9.87446 2.01745 9.35249 2.27672 8.97462 2.69448C8.59675 3.11223 8.39098 3.65751 8.39864 4.22075C8.39864 6.68775 11.7986 8.69275 12.3266 8.69275C12.8546 8.69275 16.2536 6.69275 16.2536 4.22075C16.2612 3.6564 16.0544 3.11018 15.6751 2.69225C15.2958 2.27432 14.7721 2.01578 14.2096 1.96875Z" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
, titleKey: "stepTitle", descKey: "stepDesc" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.56752 5.22656C9.29789 5.22717 9.0345 5.30779 8.81073 5.45822C8.58696 5.60865 8.41287 5.82211 8.31052 6.07156C8.20793 5.82187 8.03351 5.60827 7.80937 5.45783C7.58523 5.3074 7.32146 5.22691 7.05152 5.22656C6.6773 5.25861 6.32907 5.43109 6.07679 5.70934C5.82451 5.98759 5.68687 6.351 5.69152 6.72656C5.69152 8.37056 7.96152 9.70856 8.31052 9.70856C8.65952 9.70856 10.9295 8.37056 10.9295 6.72656C10.9341 6.35068 10.7962 5.987 10.5435 5.7087C10.2908 5.4304 9.9421 5.25813 9.56752 5.22656Z" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.1888 12L14.0938 14.619H17.2368L15.1417 17.238" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.62 7.15487C15.207 4.27987 12.1 2.04688 8.333 2.04688C4.283 2.04688 1 4.62587 1 7.80888C1.02385 8.62024 1.23623 9.41492 1.62033 10.13C2.00443 10.8451 2.54971 11.461 3.213 11.9289L3.391 15.1169L6.175 13.3169C6.367 13.3629 6.56133 13.4032 6.758 13.4379" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.666 8.88281C19.716 8.88281 22.999 11.4618 22.999 14.6448C22.9752 15.4562 22.7628 16.2509 22.3787 16.966C21.9946 17.681 21.4493 18.2969 20.786 18.7648L20.608 21.9528L17.824 20.1528C17.1173 20.3229 16.3929 20.4085 15.666 20.4078C11.616 20.4078 8.33203 17.8278 8.33203 14.6458C8.33203 11.4638 11.616 8.88281 15.666 8.88281Z" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
, titleKey: "preferencesTitle", descKey: "preferencesDesc" },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.59375 6.70703L8.68475 8.04103L10.5938 5.70703" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.91406 10.707L9.00506 12.041L10.9141 9.70703" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.48047 14.707L8.57147 16.041L10.4805 13.707" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.5938 7.375H15.5938" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.9141 11.375H15.9141" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.4805 15.375H15.4805" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.7484 17.147C17.7824 17 17.8144 16.853 17.8484 16.705C18.6974 12.1759 18.4793 7.51119 17.2114 3.08102C17.1482 2.87558 17.0205 2.69597 16.8472 2.56881C16.6739 2.44164 16.4643 2.37369 16.2494 2.37502H5.33737C5.1832 2.37568 5.03126 2.41199 4.89343 2.48109C4.75561 2.5502 4.63563 2.65025 4.54288 2.7734C4.45012 2.89656 4.3871 3.0395 4.35874 3.19105C4.33037 3.3426 4.33744 3.49865 4.37937 3.64702C6.83337 12.213 3.98438 16.79 3.98438 19.875C3.98477 20.0881 4.03054 20.2986 4.11864 20.4926C4.20675 20.6866 4.33517 20.8596 4.49535 21C4.65553 21.1405 4.8438 21.2452 5.04763 21.3073C5.25145 21.3693 5.46615 21.3872 5.67743 21.3598C5.88871 21.3324 6.09173 21.2603 6.27297 21.1482C6.4542 21.0362 6.6095 20.8869 6.72851 20.7102C6.84753 20.5335 6.92753 20.3334 6.9632 20.1234C6.99887 19.9133 6.98938 19.6981 6.93537 19.492C6.91904 19.4297 6.91719 19.3644 6.92997 19.3013C6.94275 19.2381 6.96983 19.1788 7.00912 19.1277C7.04841 19.0766 7.09887 19.0352 7.15664 19.0067C7.21441 18.9781 7.27794 18.9632 7.34238 18.963H19.4424C19.5199 18.9631 19.5959 18.9845 19.662 19.0249C19.7282 19.0653 19.7819 19.1231 19.8174 19.192C19.9343 19.4207 19.9906 19.6756 19.9808 19.9323C19.971 20.189 19.8954 20.4389 19.7613 20.658C19.6272 20.8771 19.4391 21.0581 19.215 21.1837C18.9909 21.3092 18.7383 21.3751 18.4814 21.375H5.48137" stroke="#E30BCD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
, titleKey: "paymentTitle", descKey: "paymentDesc" },
];

const ArframeImages = [
  "/icons/advantages/frame-9.svg",
  "/icons/advantages/frame-8.svg",
  "/icons/advantages/frame-7.svg",
  "/icons/advantages/frame-6.svg",
  "/icons/advantages/frame-5.svg",
  "/icons/advantages/frame-4.svg",
  "/icons/advantages/frame-3.svg",
  "/icons/advantages/frame-1.svg",
  "/icons/advantages/frame-2.svg",
];

const EnframeImages = [
  "/icons/advantages/en-frame-9.svg",
  "/icons/advantages/en-frame-8.svg",
  "/icons/advantages/en-frame-7.svg",
  "/icons/advantages/en-frame-6.svg",
  "/icons/advantages/en-frame-5.svg",
  "/icons/advantages/en-frame-4.svg",
  "/icons/advantages/en-frame-3.svg",
  "/icons/advantages/en-frame-1.svg",
  "/icons/advantages/en-frame-2.svg",
];

const Advantages = React.memo(function Advantages() {
  const t = useTranslations("advantages");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const locale = useLocale();

  // Animation to show images one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex < (locale === "ar" ? ArframeImages : EnframeImages).length - 1) {
          return prevIndex + 1;
        } else {
          // Reset to start over or keep showing all images
          return 0; // Start over
          // return prevIndex; // Keep all images visible
        }
      });
    }, 800); // 1 second delay

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="advantages" className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px] bg-[linear-gradient(201.17deg,#F5E6FF_-4.98%,#FFF4EA_119.25%)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Text column */}
        <div className="flex flex-col justify-center items-start gap-4">
          <h6 className="rounded-3xl shadow-sm px-4 py-2 bg-white text-[#301B69] font-medium text-sm flex items-center gap-2">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.875 10V13.75" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15 11.875H18.75" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.5625 3.125V6.25" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5 4.6875H8.125" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.125 14.375V16.875" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.875 15.625H14.375" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.5581 2.94194L2.94194 14.5581C2.69786 14.8021 2.69786 15.1979 2.94194 15.4419L4.55806 17.0581C4.80214 17.3021 5.19786 17.3021 5.44194 17.0581L17.0581 5.44194C17.3021 5.19786 17.3021 4.80214 17.0581 4.55806L15.4419 2.94194C15.1979 2.69786 14.8021 2.69786 14.5581 2.94194Z" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.25 6.25L13.75 8.75" stroke="#301B69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
            {t("features")}
          </h6>

          <h2 className="text-3xl md:text-5xl font-bold text-[#301B69] leading-normal">
            {t("title")}
          </h2>

          <p className="text-lg font-medium text-[#301B69]">{t("subtitle")}</p>

          <div className="grid grid-cols-2 w-full">
            {features.map((f, idx) => {
              const isLeft = idx % 2 === 0;
              const withBottomBorder = idx < 2;
              return (
                <div
                  key={f.titleKey}
                  className={[
                    "flex flex-col items-start gap-4 py-4 md:py-8",
                    isLeft ? "pe-4 md:pe-8" : "ps-4 md:ps-8",
                    withBottomBorder ? "border-b border-[#301B6914]" : "",
                    isLeft ? "rtl:border-l ltr:border-r border-[#301B6914]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                      {f.icon}
                     <p className="text-base md:text-2xl font-semibold text-[#301B69]">
                      {t(f.titleKey)}
                    </p>
                  </div>
                  <p className="text-[16px] font-normal md:font-semibold text-[#301B69C2]">
                    {t(f.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphics column with animated images */}
        <div className="flex justify-end items-center">
          <div className="relative w-full max-w-md aspect-[600/596]">
            {(locale === "ar" ? ArframeImages : EnframeImages).map((src, index) => (
              <Image
                key={index}
                src={src}
                alt=""
                width={230}
                height={166}
                className={`absolute inset-0 w-full h-full object-contain ease-in-out ${index === currentImageIndex
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : 'opacity-0 transform translate-y-2 scale-95'
                  }`}
                loading="eager"
                priority={index === 0}
                style={{
                  zIndex: index === currentImageIndex ? 10 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Advantages;