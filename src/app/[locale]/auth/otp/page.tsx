"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
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
import Cookies from "js-cookie";

export default function OtpPage() {
  const t = useTranslations("auth.otp");
  const [code, setCode] = React.useState("");
  const [seconds, setSeconds] = React.useState(60);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const router = useRouter();

  // Get email from localStorage
  const [email, setEmail] = React.useState("");
  React.useEffect(() => {
    setEmail(localStorage.getItem("registerEmail") || "");
  }, []);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  // Zod schema for validation
  const otpSchema = z.object({
    email: z.string().email(),
    code: z.string().min(4, t("codeRequired")),
    fcmToken: z.string().optional(),
  });

  const resendSchema = z.object({
    email: z.string().email(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = otpSchema.safeParse({ email, code });
    if (!result.success) {
      setError(result.error.issues[0]?.message || t("invalidCode"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", {
        email,
        code,
        fcmToken: "", // Add your FCM token here if available
      }, { headers: { skipAuth: true } });

      // Save tokens and user info in cookies
      if (res?.data?.data) {
        Cookies.set("access_token", res.data.data.access_token, {
          path: "/",
          expires: 7,
        });
        Cookies.set("refresh_token", res.data.data.refresh_token, {
          path: "/",
          expires: 30,
        });
        Cookies.set("userId", res.data.data.userId, {
          path: "/",
          expires: 30,
        });
        Cookies.set("email", res.data.data.email, {
          path: "/",
          expires: 30,
        });
        Cookies.set("isVerified", String(res.data.data.isVerified), {
          path: "/",
          expires: 30,
        });
      }

      // Success: redirect or show message
      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("invalidCode") ||
          "حدث خطأ أثناء التحقق"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSeconds(60); // Reset timer immediately for better UX
    const result = resendSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message || t("invalidEmail"));
      return;
    }
    try {
      await api.post("/auth/resend-otp", { email }, { headers: { skipAuth: true } });
      // setSeconds(60); // Already set above
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          t("invalidEmail") ||
          "حدث خطأ أثناء إعادة الإرسال"
      );
      setSeconds(0); // Allow user to try again if failed
    } finally {
      // setResendLoading(false);
    }
  };

  return (
    <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
      <Image
        src='/photos/terms-bg.svg'
        alt='Terms Background'
        width={100}
        height={100}
        className='absolute w-full inset-x-0 top-0 z-1'
      />
      <div className='mx-auto max-w-2xl px-4 relative z-2'>
        <Card className='rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]'>
          <form onSubmit={handleSubmit}>
            <CardHeader className='pb-4 pt-10'>
              <CardTitle className='text-center text-[2rem] font-extrabold text-[#1D1B23]'>
                {t("title")}
              </CardTitle>
              <p className='px-4 md:px-8 text-center text-base text-foreground/70'>
                {t("desc")}
              </p>
            </CardHeader>
            <CardContent className='py-4 px-4 md:px-12 md:pb-10'>
              <FormField
                label={<Label className='sr-only'>{t("title")}</Label>}
              >
                <TextField
                  placeholder={t("placeholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-label='رمز التحقق'
                  maxLength={8}
                />
              </FormField>
              {error && (
                <div className='text-red-600 text-center text-sm mt-2'>
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className='px-4 md:px-12 pb-10 flex flex-col gap-6'>
              <Button
                className='w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]'
                type='submit'
                disabled={loading}
              >
                {loading ? t("loading") : t("submit")}
              </Button>
              <p className='text-center text-[#301B69] font-bold'>
                {t("didntReceive")}{" "}
                <button
                  className='underline underline-offset-2 disabled:opacity-50 cursor-pointer'
                  disabled={seconds > 0 || loading}
                  onClick={handleResend}
                  type='button'
                >
                  {seconds > 0
                    ? t("resendafter", { seconds })
                    : t("resend")}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
