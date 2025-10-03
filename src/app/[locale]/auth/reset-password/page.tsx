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
import { PasswordInput } from "@/components/ui/password-input";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.reset");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const confirmError =
    confirm && confirm !== password ? "غير متطابقة" : undefined;

  return (
    <main className="relative min-h-[100dvh] pt-40 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-4 pt-10">
            <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23]">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-12 pb-10 space-y-4">
            <FormField
              label={
                <Label className="sr-only">{t("newPasswordPlaceholder")}</Label>
              }
            >
              <PasswordInput
                placeholder={t("newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="كلمة المرور الجديدة"
              />
            </FormField>
            <FormField
              label={
                <Label className="sr-only">
                  {t("confirmPasswordPlaceholder")}
                </Label>
              }
              error={confirmError}
            >
              <PasswordInput
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-label="إعادة كلمة المرور الجديدة"
              />
            </FormField>
          </CardContent>
          <CardFooter className="px-12 pb-10">
            <Button className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]">
              {t("submit")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
