"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label";
import { FormField } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import api from "@/lib/axiosClient";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.reset");
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Get email from localStorage
  const [email, setEmail] = React.useState("");
  React.useEffect(() => {
    const resetEmail = localStorage.getItem("resetPasswordEmail");
    const otpVerified = localStorage.getItem("resetOtpVerified");

    if (!resetEmail || !otpVerified) {
      // Redirect to forgot password if verification flow wasn't completed
      router.push("/auth/forgot-password");
      return;
    }
    setEmail(resetEmail);
  }, [router]);

  const confirmError =
    confirm && confirm !== password ? t("passwordMismatch") : undefined;

  // Zod schema for validation with translations
  const resetSchema = React.useMemo(() => z.object({
    email: z.string().email(),
    newPassword: z.string().min(8, t("validation.passwordMinLength")),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.passwordMismatch"),
    path: ["confirmPassword"],
  }), [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = resetSchema.safeParse({
      email,
      newPassword: password,
      confirmPassword: confirm,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || t("invalidData"));
      return;
    }

    setLoading(true);
    try {
      const resetToken = localStorage.getItem("resetToken");
      await api.post(
        "/auth/reset-password",
        {
          email,
          newPassword: password,
          confirmPassword: confirm,
        },
        {
          headers: {
            skipAuth: true,
            ...(resetToken ? { Authorization: `Bearer ${resetToken}` } : {}),
          },
        }
      );

      // Clear localStorage
      localStorage.removeItem("resetPasswordEmail");
      localStorage.removeItem("resetOtpVerified");
      localStorage.removeItem("resetToken");

      setSuccess(true);

      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);

    } catch (err: any) {
      setError(
        err?.response?.data?.message || t("apiError")
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
        <div className="mx-auto max-w-2xl px-4 relative z-2">
          <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
            <CardContent className="py-10 px-4 md:px-12 text-center">
              <div className="text-green-600 flex justify-center mb-4">
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_9524_22198)">
                    <circle cx="140" cy="136" r="120" fill="#F6F8FB" />
                  </g>
                  <mask id="mask0_9524_22198"  maskUnits="userSpaceOnUse" x="20" y="16" width="240" height="240">
                    <circle cx="140" cy="136" r="120" fill="#CFF7D3" />
                  </mask>
                  <g mask="url(#mask0_9524_22198)">
                  </g>
                  <g clipPath="url(#clip0_9524_22198)">
                    <path d="M140.5 226.5C190.206 226.5 230.5 186.206 230.5 136.5C230.5 86.7944 190.206 46.5 140.5 46.5C90.7944 46.5 50.5 86.7944 50.5 136.5C50.5 186.206 90.7944 226.5 140.5 226.5Z" fill="#32BA7C" />
                    <path d="M117.504 177.101L163.782 223.379C202.11 213.158 230.501 178.237 230.501 136.502C230.501 135.65 230.501 134.799 230.501 133.947L194.16 100.445L117.504 177.101Z" fill="#0AA06E" />
                    <path d="M142.771 156.658C146.746 160.632 146.746 167.446 142.771 171.421L134.538 179.655C130.563 183.629 123.749 183.629 119.774 179.655L83.7174 143.314C79.7426 139.339 79.7426 132.525 83.7174 128.55L91.9508 120.317C95.9256 116.342 102.739 116.342 106.714 120.317L142.771 156.658Z" fill="white" />
                    <path d="M174.285 93.9108C178.26 89.936 185.074 89.936 189.049 93.9108L197.282 102.144C201.257 106.119 201.257 112.933 197.282 116.908L134.822 179.084C130.847 183.059 124.033 183.059 120.058 179.084L111.825 170.851C107.85 166.876 107.85 160.062 111.825 156.087L174.285 93.9108Z" fill="white" />
                  </g>
                  <circle cx="25.4913" cy="243.489" r="2.49116" transform="rotate(180 25.4913 243.489)" fill="#F1F3F7" />
                  <circle cx="58.4913" cy="248.489" r="2.49116" transform="rotate(180 58.4913 248.489)" fill="#C1CBD4" />
                  <path d="M35.267 229.68L33.4211 231.526L32.0866 230.191L33.9325 228.345L31.8462 226.259L33.2524 224.853L35.3386 226.939L37.1896 225.088L38.5242 226.423L36.6732 228.274L38.6724 230.273L37.2663 231.679L35.267 229.68Z" fill="#85C0F9" />
                  <circle cx="2.49116" cy="2.49116" r="2.49116" transform="matrix(1 0 0 -1 64.541 24.9844)" fill="#C1CBD4" />
                  <circle cx="2.49116" cy="2.49116" r="2.49116" transform="matrix(1 0 0 -1 37.541 29.9805)" fill="#F1F3F7" />
                  <path d="M35.2564 56.6797L37.1023 58.5256L38.4369 57.1911L36.591 55.3452L38.6772 53.259L37.271 51.8528L35.1848 53.939L33.3338 52.088L31.9993 53.4226L33.8503 55.2736L31.851 57.2729L33.2571 58.679L35.2564 56.6797Z" fill="#85C0F9" />
                  <path d="M38.5 171.781C37.2956 171.685 34.5977 172.417 33.4414 176.117C31.9961 180.742 31.9961 189.992 20 190.137" stroke="#FE5284" strokeWidth="4" strokeLinecap="round" />
                  <path d="M261.342 213.3C258.352 213.266 252.154 211.277 251.283 203.595C250.478 196.493 259.708 196.751 257.553 202.451C255.731 207.27 241.945 212.287 236.811 193.964" stroke="#F39958" strokeWidth="4" strokeLinecap="round" />
                  <path d="M190.283 27.9297C194.093 25.0044 203 19.8673 213.273 25.2986" stroke="#85C0F9" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <filter id="filter0_d_9524_22198" x="0" y="0" width="280" height="280" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="10" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.905882 0 0 0 0 0.933333 0 0 0 0 0.984314 0 0 0 0.15 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9524_22198" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9524_22198" result="shape" />
                    </filter>
                    <clipPath id="clip0_9524_22198">
                      <rect width="180" height="180" fill="white" transform="translate(50.5 46.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1D1B23] mb-4">
                {t("successTitle")}
              </h2>
              <p className="text-[#301B69] mb-6">
                {t("successMessage")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
      <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
      <div className="mx-auto max-w-2xl px-4 relative z-2">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4 pt-10">
              <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23]">
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-4 md:px-12 md:pb-10 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <FormField
                label={
                  <Label className="sr-only">{t("newPasswordLabel")}</Label>
                }
              >
                <PasswordInput
                  placeholder={t("newPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label={t("newPasswordLabel")}
                  required
                />
              </FormField>
              <FormField
                label={
                  <Label className="sr-only">
                    {t("confirmPasswordLabel")}
                  </Label>
                }
                error={confirmError}
              >
                <PasswordInput
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-label={t("confirmPasswordLabel")}
                  required
                />
              </FormField>
            </CardContent>
            <CardFooter className="px-4 md:px-12 pb-10">
              <Button
                type="submit"
                disabled={loading || !!confirmError}
                className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)] disabled:opacity-70"
              >
                {loading ? t("loading") : t("submit")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
