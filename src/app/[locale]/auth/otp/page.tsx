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
import { Link } from "@/i18n/navigation";

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
    <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
      style={{
      }}>
      <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
      <div className="mx-auto max-w-2xl px-4 relative z-2">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader  className="pb-4 pt-10">
            <CardTitle className="text-center text-[2rem] font-extrabold text-[#1D1B23]">
              {t("title")}
            </CardTitle>
            <p className="px-4 md:px-8 text-center text-base text-foreground/70">
              {t("desc")}
            </p>
          </CardHeader>
          <CardContent className="py-4 px-4 md:px-12 md:pb-10">
            <FormField label={<Label className="sr-only">{t("title")}</Label>}>
              <TextField
                placeholder={t("placeholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-label="رمز التحقق"
              />
            </FormField>
          </CardContent>
          <CardFooter className="px-4 md:px-12 pb-10 flex flex-col gap-6">
            <Link href={"/auth/reset-password"}>
              <Button className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-4 text-xl font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]">
                {t("submit")}
              </Button>
            </Link>
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
    </section>
  );
}
