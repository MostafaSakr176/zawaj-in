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
            ...(resetToken ? { Authorization : `Bearer ${resetToken}` } : {}),
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
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1D1B23] mb-4">
                {t("successTitle")}
              </h2>
              <p className="text-[#301B69] mb-6">
                {t("successMessage")}
              </p>
              <Link href="/auth/sign-in">
                <Button className="w-full rounded-[20px] bg-[#301B69] hover:bg-[#2D0B5A]">
                  {t("signInButton")}
                </Button>
              </Link>
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
