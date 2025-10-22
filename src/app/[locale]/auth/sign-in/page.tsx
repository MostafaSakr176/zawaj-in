"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import api from "@/lib/axiosClient";
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
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

const MailIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 4.375L10 11.25L2.5 4.375"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 4.375H17.5V15C17.5 15.1658 17.4342 15.3247 17.3169 15.4419C17.1997 15.5592 17.0408 15.625 16.875 15.625H3.125C2.95924 15.625 2.80027 15.5592 2.68306 15.4419C2.56585 15.3247 2.5 15.1658 2.5 15V4.375Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.63602 10L2.69238 15.4484"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.307 15.4484L11.3633 10"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12.5C10.8629 12.5 11.5625 11.8004 11.5625 10.9375C11.5625 10.0746 10.8629 9.375 10 9.375C9.13706 9.375 8.4375 10.0746 8.4375 10.9375C8.4375 11.8004 9.13706 12.5 10 12.5Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.5V14.375"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 6.875H3.75C3.40482 6.875 3.125 7.15482 3.125 7.5V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V7.5C16.875 7.15482 16.5952 6.875 16.25 6.875Z"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.1875 6.875V4.0625C7.1875 3.31658 7.48382 2.60121 8.01126 2.07376C8.53871 1.54632 9.25408 1.25 10 1.25C10.7459 1.25 11.4613 1.54632 11.9887 2.07376C12.5162 2.60121 12.8125 3.31658 12.8125 4.0625V6.875"
      stroke="#AFAFAF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



export default function SignInPage() {
  const [state, setState] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const t = useTranslations("auth.signIn");
  const router = useRouter();
  const { refreshProfile } = useAuth();


  const loginSchema = z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(6, t("passwordRequired")),
    fcmToken: z.string().optional(),
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ ...state });
    if (!result.success) {
      setError(result.error.issues[0]?.message || t("invalidData"));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        {
          email: state.email,
          password: state.password,
          fcmToken: "optional-fcm-token",
        },
        { headers: { skipAuth: true } }
      );

      if (res?.data?.data) {
        Cookies.set("access_token", res.data.data.access_token, {
          path: "/",
          expires: 7,
        });
        Cookies.set("refresh_token", res.data.data.refresh_token, {
          path: "/",
          expires: 30,
        });
        await refreshProfile();
      }

      if (res.data.data?.termsAccepted) {
        router.push("/home"); 
        return;
      }

      router.push("/terms-of-use");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        t("loginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  const emailError =
    state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
      ? "صيغة البريد غير صحيحة"
      : undefined;

  return (
    <section className="relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
      <Image
        src="/photos/terms-bg.webp"
        alt="Terms Background"
        width={100}
        height={100}
        className="absolute w-full inset-x-0 top-0 z-1"
      />
      <div className="px-4 mx-auto max-w-xl relative z-2">
        <Card className="rounded-[32px] py-6 px-4 md:px-16 border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)] ">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4 pt-10">
              <CardTitle className="text-center text-3xl font-extrabold text-[#1D1B23] md:text-5xl">
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <FormField
                label={<Label className="sr-only">{t("emailLabel")}</Label>}
                error={emailError}
              >
                <TextField
                  placeholder={t("emailPlaceholder")}
                  startAdornment={MailIcon}
                  endAdornment={null}
                  value={state.email}
                  onChange={(e) =>
                    setState((s) => ({ ...s, email: e.target.value }))
                  }
                  className="text-[1rem]"
                  aria-label={t("emailLabel")}
                />
              </FormField>

              <FormField
                label={<Label className="sr-only">{t("passwordLabel")}</Label>}
              >
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  startAdornment={LockIcon}
                  togglePosition="end"
                  value={state.password}
                  onChange={(e) =>
                    setState((s) => ({ ...s, password: e.target.value }))
                  }
                  className="text-[1rem]"
                  aria-label={t("passwordLabel")}
                />
              </FormField>

              {error && (
                <div className="text-red-600 text-center text-sm">{error}</div>
              )}

              <div className="pt-2">
                <Button
                  className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? t("loading") : t("submit")}
                </Button>
              </div>

              <div className="space-y-6 md:space-y-9 py-2 text-center text-sm">
                <p>
                  {t("forgotLink")}{" "}
                  <Link
                    className="font-bold text-[#301B69] underline-offset-2 hover:underline"
                    href="/auth/forgot-password"
                  >
                    {t("forgotLink")}
                  </Link>
                </p>
                <p>
                  {t("registerLink")}{" "}
                  <Link
                    className="font-bold text-[#301B69] underline-offset-2 hover:underline"
                    href="/auth/register"
                  >
                    {t("registerLink")}
                  </Link>
                </p>
              </div>
            </CardContent>
            <CardFooter />
          </form>
        </Card>
      </div>
    </section>
  );
}
