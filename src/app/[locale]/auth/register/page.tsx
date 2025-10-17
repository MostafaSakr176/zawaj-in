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
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import Image from "next/image";
import api from "@/lib/axiosClient";
import { useRouter } from "@/i18n/navigation";

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

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const [form, setForm] = React.useState({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  const noArabicRegex = /^[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+$/;

  // Create Zod schema with translations
  const registerSchema = React.useMemo(
    () =>
      z
        .object({
          fullName: z
            .string()
            .min(2, t("validation.nameRequired")),
          gender: z.enum(["male", "female"], t("validation.genderRequired")),
          email: z
            .string()
            .email(t("validation.emailInvalid"))
            .regex(noArabicRegex, t("validation.noArabic")),
          phone: z
            .string()
            .min(8, t("validation.phoneRequired")),
          password: z
            .string()
            .min(6, t("validation.passwordRequired"))
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              t("validation.passwordComplexity")
            ),
          confirmPassword: z
            .string()
            .min(6, t("validation.confirmRequired"))
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("validation.passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const genderOptions = React.useMemo(
    () => [
      { value: "male", label: t("genderMale") },
      { value: "female", label: t("genderFemale") },
    ],
    [t]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    // Validate with zod
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/auth/register",
        {
          fullName: form.fullName,
          gender: form.gender,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
        { headers: { skipAuth: true } }
      );

      setSuccess(t("successMessage"));
      // Save email to localStorage for OTP page
      if (typeof window !== "undefined") {
        localStorage.setItem("registerEmail", form.email);
      }
      router.push("/auth/verify-email");
    } catch (error: any) {
      // Handle API error messages
      if (error?.response?.data?.errors) {
        // If the API returns field errors as an object
        setErrors(error.response.data.errors);
      } else if (error?.response?.data?.message) {
        // If the API returns a general message
        setErrors({ api: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
      <Image
        src="/photos/terms-bg.webp"
        alt="Terms Background"
        width={100}
        height={100}
        className="absolute w-full inset-x-0 top-0 z-1"
      />
      <div className="mx-auto max-w-3xl px-4 relative z-2">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-4 pt-10">
            <CardTitle className="text-center text-[2rem] font-semibold text-[#1D1B23] md:text-5xl">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 py-4 px-4 md:px-32 md:pb-10">
            <FormField
              label={<Label>{t("usernameLabel")}</Label>}
              hint={t("usernameHint")}
              error={errors.fullName}
            >
              <TextField
                placeholder={t("usernameHint")}
                value={form.fullName}
                type="text"
                onChange={(e) =>
                  setForm((s) => ({ ...s, fullName: e.target.value }))
                }
              />
            </FormField>

            <FormField
              label={<Label>{t("genderLabel")}</Label>}
              error={errors.gender}
            >
              <Select
                options={genderOptions}
                placeholder={t("genderLabel")}
                value={form.gender}
                onChange={(e) =>
                  setForm((s) => ({ ...s, gender: e.target.value }))
                }
              />
            </FormField>

            <FormField
              label={<Label>{t("emailLabel")}</Label>}
              error={errors.email}
            >
              <TextField
                placeholder={t("emailPlaceholder")}
                startAdornment={MailIcon}
                value={form.email}
                type="email"
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
              />
            </FormField>

            <FormField
              label={<Label>{t("phoneLabel")}</Label>}
              error={errors.phone}

            >
              <div dir="ltr" className="w-full">

                <PhoneInput
                  value={form.phone}
                  country="sa"
                  placeholder={t("phonePlaceholder") || "Enter your phone number"}
                  onChange={(formattedValue: string) => {
                    setForm((s) => ({ ...s, phone: formattedValue }));
                  }}
                />
              </div>

            </FormField>

            <FormField
              label={<Label>{t("passwordLabel")}</Label>}
              error={errors.password}
            >
              <PasswordInput
                placeholder="********"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
              />
            </FormField>

            <FormField
              label={<Label>{t("confirmLabel")}</Label>}
              error={errors.confirmPassword}
            >
              <PasswordInput
                placeholder="********"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((s) => ({ ...s, confirmPassword: e.target.value }))
                }
              />
            </FormField>

            {errors.api && (
              <div className="text-red-500 text-sm text-center">
                {errors.api}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}
          </CardContent>
          <CardFooter className="pb-8 px-4 md:px-32 md:pb-10">
            <Button
              className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("loading") : t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}