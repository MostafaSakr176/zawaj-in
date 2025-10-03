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

export default function OtpPage() {
  const t = useTranslations("auth.otp");
  const [code, setCode] = React.useState("");
  const [seconds, setSeconds] = React.useState(60);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <main className="relative min-h-[100dvh] pt-40 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-2 pt-10">
            <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23]">
              {t("title")}
            </CardTitle>
            <p className="px-8 text-center text-base text-foreground/70">
              {t("desc")}
            </p>
          </CardHeader>
          <CardContent className="px-12 pb-10">
            <FormField label={<Label className="sr-only">{t("title")}</Label>}>
              <TextField
                placeholder={t("placeholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-label="رمز التحقق"
              />
            </FormField>
          </CardContent>
          <CardFooter className="px-12 pb-10 flex flex-col gap-6">
            <Button className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]">
              {t("submit")}
            </Button>
            <p className="text-center text-[#301B69] font-bold">
              <button
                className="underline underline-offset-2 disabled:opacity-50"
                disabled={seconds > 0}
                onClick={() => setSeconds(60)}
              >
                {t("resend", { seconds })}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
