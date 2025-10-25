"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
import { TextField } from "@/components/ui/text-field";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import api from "@/lib/axiosClient";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot");
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(
        "/auth/forget-password",
        { email },
        { headers: { skipAuth: true } }
      );
      
      // Save email to localStorage for use in verify page
      localStorage.setItem("resetPasswordEmail", email);
      
      setSuccess(true);
      // Optionally redirect to OTP page after a delay
      setTimeout(() => {
        router.push("/auth/verify-reset-password");
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || t("error")
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="relative pt-24 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
        <Image
          src="/photos/terms-bg.webp"
          alt="Terms Background"
          width={100}
          height={100}
          className="absolute w-full inset-x-0 top-0 z-1"
        />
        <div className="mx-auto max-w-2xl px-4 relative z-2">
          <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
            <CardContent className="py-10 px-4 md:px-12 text-center">
              <div className="text-green-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1D1B23] mb-4">
                {t("successTitle")}
              </h2>
              <p className="text-[#301B69] mb-6">
                {t("successMessage")}
              </p>
              <Link href="/auth/verify-reset-password">
                <Button className="w-full rounded-[20px] bg-[#301B69] hover:bg-[#2D0B5A]">
                  {t("nextButton")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-24 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
      <Image
        src="/photos/terms-bg.webp"
        alt="Terms Background"
        width={100}
        height={100}
        className="absolute w-full inset-x-0 top-0 z-1"
      />
      <div className="mx-auto max-w-2xl px-4 relative z-2">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-4 pt-10">
            <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23]">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="py-4 px-4 md:px-12 md:pb-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <FormField label={<Label className="sr-only">{t("emailLabel")}</Label>}>
                <TextField
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label={t("emailLabel")}
                  required
                />
              </FormField>
            </CardContent>
            <CardFooter className="px-4 md:px-12 pb-10">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)] disabled:opacity-70"
              >
                {loading ? t("sending") : t("submit")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
