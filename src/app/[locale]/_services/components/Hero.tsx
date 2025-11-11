"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";

// Memoize icons array outside component for performance
const ICONS = [
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.8451 23.6883C19.7524 23.6883 22.1092 21.3315 22.1092 18.4242C22.1092 15.517 19.7524 13.1602 16.8451 13.1602C13.9379 13.1602 11.5811 15.517 11.5811 18.4242C11.5811 21.3315 13.9379 23.6883 16.8451 23.6883Z" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.7939 15.2656C27.0199 15.2646 28.2292 15.5495 29.3258 16.0977C30.4224 16.6459 31.376 17.4422 32.111 18.4235" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5791 18.4238C2.31402 17.4424 3.26768 16.646 4.36431 16.0978C5.46094 15.5495 6.67031 15.2646 7.89635 15.2656" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.26855 28.425C9.96015 27.0045 11.0372 25.8071 12.3767 24.9694C13.7163 24.1317 15.2644 23.6875 16.8443 23.6875C18.4242 23.6875 19.9723 24.1317 21.3118 24.9694C22.6514 25.8071 23.7284 27.0045 24.42 28.425" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.89601 15.2662C7.09698 15.2661 6.31447 15.0386 5.63988 14.6104C4.96528 14.1822 4.42643 13.5709 4.08626 12.8479C3.74608 12.1249 3.61862 11.32 3.71875 10.5273C3.81888 9.73453 4.14247 8.98664 4.65174 8.37093C5.16101 7.75522 5.83494 7.2971 6.59483 7.05007C7.35471 6.80303 8.1692 6.77728 8.94318 6.97582C9.71715 7.17436 10.4187 7.58899 10.9658 8.1713C11.513 8.75361 11.8832 9.47957 12.0332 10.2644" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21.6562 10.2652C21.8062 9.48023 22.1763 8.75414 22.7235 8.1717C23.2707 7.58926 23.9723 7.17451 24.7463 6.9759C25.5204 6.77728 26.335 6.803 27.095 7.05004C27.855 7.29708 28.529 7.75524 29.0384 8.37103C29.5477 8.98682 29.8713 9.73482 29.9715 10.5277C30.0716 11.3205 29.9441 12.1255 29.6038 12.8486C29.2636 13.5716 28.7246 14.183 28.0499 14.6112C27.3752 15.0395 26.5926 15.2669 25.7934 15.267" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  ,
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.97818 23.2921C4.40853 20.646 3.85882 17.518 4.43228 14.4953C5.00575 11.4726 6.66294 8.76322 9.09267 6.87592C11.5224 4.98862 14.5575 4.05322 17.6281 4.24537C20.6987 4.43752 23.5936 5.744 25.7691 7.91948C27.9446 10.095 29.251 12.9898 29.4432 16.0604C29.6354 19.131 28.7 22.1661 26.8127 24.5959C24.9254 27.0256 22.2161 28.6828 19.1934 29.2563C16.1707 29.8298 13.0426 29.2801 10.3965 27.7104L10.3966 27.7103L6.03312 28.957C5.85259 29.0086 5.66155 29.011 5.47979 28.9639C5.29804 28.9168 5.13219 28.8219 4.99943 28.6892C4.86667 28.5564 4.77182 28.3905 4.72473 28.2088C4.67763 28.027 4.68 27.836 4.73158 27.6555L5.97828 23.292L5.97818 23.2921Z" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.8448 18.4241C17.717 18.4241 18.4241 17.717 18.4241 16.8448C18.4241 15.9727 17.717 15.2656 16.8448 15.2656C15.9727 15.2656 15.2656 15.9727 15.2656 16.8448C15.2656 17.717 15.9727 18.4241 16.8448 18.4241Z" fill="white" />
    <path d="M10.5284 18.4241C11.4006 18.4241 12.1077 17.717 12.1077 16.8448C12.1077 15.9727 11.4006 15.2656 10.5284 15.2656C9.65626 15.2656 8.94922 15.9727 8.94922 16.8448C8.94922 17.717 9.65626 18.4241 10.5284 18.4241Z" fill="white" />
    <path d="M23.1622 18.4241C24.0344 18.4241 24.7414 17.717 24.7414 16.8448C24.7414 15.9727 24.0344 15.2656 23.1622 15.2656C22.29 15.2656 21.583 15.9727 21.583 16.8448C21.583 17.717 22.29 18.4241 23.1622 18.4241Z" fill="white" />
  </svg>
  ,
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.8447 29.4784C23.8221 29.4784 29.4784 23.8221 29.4784 16.8447C29.4784 9.86726 23.8221 4.21094 16.8447 4.21094C9.86726 4.21094 4.21094 9.86726 4.21094 16.8447C4.21094 23.8221 9.86726 29.4784 16.8447 29.4784Z" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.1075 15.7912C12.9797 15.7912 13.6868 15.0842 13.6868 14.212C13.6868 13.3399 12.9797 12.6328 12.1075 12.6328C11.2354 12.6328 10.5283 13.3399 10.5283 14.212C10.5283 15.0842 11.2354 15.7912 12.1075 15.7912Z" fill="white" />
    <path d="M21.5831 15.7912C22.4553 15.7912 23.1623 15.0842 23.1623 14.212C23.1623 13.3399 22.4553 12.6328 21.5831 12.6328C20.7109 12.6328 20.0039 13.3399 20.0039 14.212C20.0039 15.0842 20.7109 15.7912 21.5831 15.7912Z" fill="white" />
    <path d="M22.318 20.0039C21.7633 20.9643 20.9656 21.7618 20.0051 22.3163C19.0446 22.8708 17.9551 23.1627 16.846 23.1627C15.7369 23.1627 14.6474 22.8708 13.6869 22.3163C12.7264 21.7619 11.9287 20.9644 11.374 20.004" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  ,
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.8447 28.4255C16.8447 28.4255 3.68457 21.0559 3.68457 12.107C3.68484 10.5253 4.23289 8.99252 5.23555 7.76926C6.23821 6.54601 7.63359 5.70776 9.18445 5.39705C10.7353 5.08634 12.3459 5.32233 13.7424 6.06492C15.1389 6.8075 16.2352 8.01083 16.8447 9.47032L16.8447 9.47034C17.4543 8.01084 18.5505 6.80751 19.947 6.06492C21.3435 5.32234 22.9541 5.08634 24.505 5.39705C26.0558 5.70776 27.4512 6.546 28.4539 7.76926C29.4566 8.99252 30.0046 10.5253 30.0049 12.107C30.0049 21.0559 16.8447 28.4255 16.8447 28.4255Z" stroke="white" strokeWidth="1.6845" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

];

const Hero = React.memo(() => {
  const t = useTranslations("hero");
  const {isAuthenticated} = useAuth()

  return (
    <section className="pt-40 md:pt-48 pb-20 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Content */}
          <div>
            <p
              className="text-xl md:text-3xl mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
              }}
            >
              {t("welcomeText")}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#301B69] mb-6 leading-normal">
              <span>{t("mainTitle")}</span>
              <br />
              <span>{t("subtitle")}</span>
            </h1>
            {!isAuthenticated && <div className="flex items-center gap-4 mb-8">
              <Link href="/auth/sign-in">
                <Button>
                  <ArrowRight size={16} className="rtl:inline-block ltr:hidden" />
                  <ArrowLeft size={16} className="rtl:hidden ltr:inline-block" />
                  {t("registerButton")}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary">{t("newRegisterButton")}</Button>
              </Link>
            </div>}
          </div>
          {/* Image and Stats */}
          <div className="flex justify-end rtl:lg:pl-8 ltr:lg:pr-8">
            <div className="relative w-[90%] md:w-[70%] mx-auto md:mx-0">
              <Image
                src="/photos/hero-img.webp"
                alt={t("mainTitle")}
                width={320}
                height={400}
                className="w-full object-cover"
                priority // Only hero image should be priority for FCP
              />
              {/* Success Rate Card */}
              <div className="absolute -top-8 rtl:-left-4 ltr:-right-4 rtl:md:-left-8 ltr:md:-right-8 border-[0.84px] border-[#ECEFF2] bg-white rounded-xl md:rounded-3xl px-2 md:px-4 pt-2 shadow-lg z-10">
                <div className="text-center">
                  <div className="relative w-28 h-18 md:w-36 md:h-24 mx-auto">
                    <svg viewBox="0 0 100 50">
                      <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        stroke="#F3EFFE"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="113 126"
                      />
                    </svg>
                    <div className="w-full absolute top-5 md:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
                      <span className="text-md md:text-2xl font-semibold font-sans text-[#343B46]">
                        {t("successRate")}
                      </span>
                      <p className="text-xs text-gray-600 font-medium">
                        {t("successRateLabel")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Brain Icon */}
              <div
                className="absolute -top-4 rtl:-right-4 ltr:-left-4 md:-top-8 rtl:md:-right-8 ltr:md:-left-8 rounded-full p-3 md:p-4 shadow-lg z-10 border-3 border-white"
                style={{
                  background:
                    "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.7541 6.96875C12.3946 6.96956 12.0434 7.07706 11.745 7.27763C11.4467 7.4782 11.2146 7.76281 11.0781 8.09542C10.9413 7.7625 10.7087 7.47769 10.4099 7.27711C10.111 7.07653 9.75935 6.96921 9.39942 6.96875C8.90046 7.01148 8.43615 7.24145 8.09978 7.61245C7.7634 7.98345 7.57989 8.468 7.58609 8.96875C7.58609 11.1608 10.6128 12.9447 11.0781 12.9447C11.5434 12.9447 14.5701 11.1608 14.5701 8.96875C14.5762 8.46758 14.3924 7.98267 14.0554 7.6116C13.7185 7.24053 13.2535 7.01084 12.7541 6.96875Z" stroke="url(#paint0_linear_9524_15951)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22.5353 16.3984C22.1758 16.3991 21.8245 16.5065 21.5261 16.7071C21.2277 16.9077 20.9956 17.1924 20.8593 17.5251C20.723 17.1919 20.4905 16.9068 20.1916 16.7061C19.8926 16.5055 19.5407 16.3984 19.1807 16.3984C18.6818 16.4415 18.2177 16.6715 17.8814 17.0425C17.5451 17.4134 17.3614 17.8978 17.3673 18.3984C17.3673 20.5918 20.394 22.3744 20.8593 22.3744C21.3247 22.3744 24.3513 20.5918 24.3513 18.3984C24.3575 17.8973 24.1736 17.4124 23.8367 17.0413C23.4997 16.6702 23.0348 16.4405 22.5353 16.3984Z" stroke="url(#paint1_linear_9524_15951)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.8293 9.54504C20.2786 5.71171 16.1359 2.73438 11.1133 2.73438C5.71327 2.73438 1.33594 6.17304 1.33594 10.417C1.36774 11.4989 1.65091 12.5584 2.16305 13.5119C2.67518 14.4653 3.40221 15.2865 4.2866 15.9104L4.52394 20.161L8.23594 17.761C8.49194 17.8224 8.75105 17.8762 9.01327 17.9224" stroke="url(#paint2_linear_9524_15951)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.888 11.8438C26.288 11.8438 30.6654 15.2824 30.6654 19.5264C30.6336 20.6082 30.3504 21.6678 29.8383 22.6213C29.3261 23.5747 28.5991 24.3959 27.7147 25.0198L27.4774 29.2704L23.7654 26.8704C22.8231 27.0972 21.8572 27.2113 20.888 27.2104C15.488 27.2104 11.1094 23.7704 11.1094 19.5278C11.1094 15.2851 15.488 11.8438 20.888 11.8438Z" stroke="url(#paint3_linear_9524_15951)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="paint0_linear_9524_15951" x1="12.0744" y1="5.72881" x2="8.99943" y2="15.0091" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E6FF" />
                      <stop offset="1" stopColor="#FFF4EA" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_9524_15951" x1="21.8556" y1="15.1585" x2="18.7807" y2="24.4388" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E6FF" />
                      <stop offset="1" stopColor="#FFF4EA" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_9524_15951" x1="13.8633" y1="-0.881425" x2="4.57869" y2="25.9378" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E6FF" />
                      <stop offset="1" stopColor="#FFF4EA" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_9524_15951" x1="23.677" y1="8.22795" x2="14.4158" y2="35.0655" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5E6FF" />
                      <stop offset="1" stopColor="#FFF4EA" />
                    </linearGradient>
                  </defs>
                </svg>

              </div>
              {/* Bottom Icons Card */}
              <div className="w-52 absolute -bottom-10 md:-bottom-6 rtl:-right-4 ltr:-left-4 rtl:md:-right-8 ltr:md:-left-8 bg-white rounded-xl md:rounded-2xl px-4 py-3 shadow-lg z-10">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex -space-x-2">
                    {ICONS.map((icon, idx) => (
                      <div
                        key={idx}
                        className="rounded-full p-2 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)",
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-[#301B69]">
                    <p className="font-medium">{t("zodiacText")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;