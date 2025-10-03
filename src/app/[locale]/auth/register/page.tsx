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
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";

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
    username: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    bio: "",
  });

  const genderOptions = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
  ];

  const emailError =
    form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "صيغة البريد غير صحيحة"
      : undefined;
  const confirmError =
    form.confirm && form.confirm !== form.password ? "غير متطابقة" : undefined;

  return (
    <main className="relative min-h-[100dvh] pt-40 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-1 pt-10">
            <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23] md:text-5xl">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-32 pb-10">
            <FormField
              label={<Label>{t("usernameLabel")}</Label>}
              hint={t("usernameHint")}
            >
              <TextField
                placeholder={t("usernameHint")}
                value={form.username}
                onChange={(e) =>
                  setForm((s) => ({ ...s, username: e.target.value }))
                }
              />
            </FormField>

            <FormField label={<Label>{t("genderLabel")}</Label>}>
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
              error={emailError}
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

            <FormField label={<Label>{t("phoneLabel")}</Label>}>
              <PhoneInput
                placeholder="5xxxxxxxx"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
              />
            </FormField>

            <FormField label={<Label>{t("passwordLabel")}</Label>}>
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
              error={confirmError}
            >
              <PasswordInput
                placeholder="********"
                value={form.confirm}
                onChange={(e) =>
                  setForm((s) => ({ ...s, confirm: e.target.value }))
                }
              />
            </FormField>
          </CardContent>
          <CardFooter className="px-32 pb-10">
            <Button className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]">
              {t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
