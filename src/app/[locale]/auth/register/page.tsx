"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod"; // <-- Make sure you have an axios instance here

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

// Zod schema for validation
const registerSchema = z.object({
  fullName: z.string().min(2, "الاسم مطلوب"),
  gender: z.enum(["male", "female"], "النوع مطلوب"),
  email: z.string().email("صيغة البريد غير صحيحة"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  password: z.string().min(6, "كلمة المرور مطلوبة"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

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

  const genderOptions = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
  ];

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
      await api.post("/auth/register", {
        fullName: form.fullName,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },{ headers: { skipAuth: true } });
      setSuccess("تم التسجيل بنجاح!");
      // Save email to localStorage for OTP page
      if (typeof window !== "undefined") {
        localStorage.setItem("registerEmail", form.email);
      }
      router.push("/auth/otp");
    } catch (error) {
      setErrors({ api: "حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقًا." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
      style={{
      }}>
      <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
      <div className="mx-auto max-w-3xl px-4 relative z-2">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader  className="pb-4 pt-10">
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
                onChange={(e) =>
                  setForm((s) => ({ ...s, fullName: e.target.value }))
                }
              />
            </FormField>

            <FormField label={<Label>{t("genderLabel")}</Label>} error={errors.gender}>
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
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
              />
            </FormField>

            <FormField label={<Label>{t("phoneLabel")}</Label>} error={errors.phone}>
              <PhoneInput
                placeholder="5xxxxxxxx"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
              />
            </FormField>

            <FormField label={<Label>{t("passwordLabel")}</Label>} error={errors.password}>
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
              {loading ? "جاري التسجيل..." : t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
