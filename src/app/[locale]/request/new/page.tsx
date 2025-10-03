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
import { Stepper } from "@/components/ui/stepper";
import { FormField } from "@/components/ui/form";
import Label from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";

export default function NewRequestPage() {
  const t = useTranslations("request");
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState<"rtl" | "ltr">("ltr");

  React.useEffect(() => {
    const d = document?.documentElement?.getAttribute("dir");
    if (d === "rtl" || d === "ltr") setDir(d);
  }, []);

  const steps = [
    {
      id: "nationality",
      label: t("steps.nationality.label"),
      description: t("steps.nationality.desc"),
    },
    {
      id: "you",
      label: t("steps.you.label"),
      description: t("steps.you.desc"),
    },
    {
      id: "partner",
      label: t("steps.partner.label"),
      description: t("steps.partner.desc"),
    },
    {
      id: "types",
      label: t("steps.types.label"),
      description: t("steps.types.desc"),
    },
  ];

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="relative min-h-[100dvh] pt-40 bg-gradient-to-br from-[#F5E6FF] via-[#F5E6FF] to-[#FFF4EA] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
          <CardHeader className="pb-2 pt-10">
            <CardTitle className="text-start text-3xl font-extrabold text-[#1D1B23]">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10 px-10 pb-10">
            <Stepper steps={steps} activeIndex={step} direction={dir} />

            {step === 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label={<Label>{t("fields.nationality")}</Label>}
                  required
                >
                  <Select
                    options={[
                      { value: "sa", label: "السعودية" },
                      { value: "eg", label: "مصر" },
                    ]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.city")}</Label>}>
                  <Select
                    options={[{ value: "riyadh", label: "الرياض" }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.age")}</Label>}>
                  <TextField placeholder={t("placeholders.write")} />
                </FormField>
                <FormField label={<Label>{t("fields.origin")}</Label>}>
                  <TextField placeholder={t("placeholders.write")} />
                </FormField>
                <FormField
                  label={<Label>{t("fields.marital")}</Label>}
                  required
                >
                  <Select
                    options={[{ value: "single", label: "أعزب" }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.education")}</Label>}>
                  <TextField placeholder={t("placeholders.write")} />
                </FormField>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField label={<Label>{t("fields.weight")}</Label>} required>
                  <TextField placeholder={t("placeholders.weight")} />
                </FormField>
                <FormField label={<Label>{t("fields.height")}</Label>} required>
                  <TextField placeholder={t("placeholders.height")} />
                </FormField>
                <FormField label={<Label>{t("fields.skin")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.hair")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.eyes")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.hairType")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.home")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.job")}</Label>}>
                  <TextField placeholder={t("placeholders.write")} />
                </FormField>
                <div className="md:col-span-2">
                  <FormField
                    label={<Label>{t("fields.about")}</Label>}
                    hint={t("hints.serious")}
                  >
                    <Textarea rows={5} placeholder="..." />
                  </FormField>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField label={<Label>{t("fields.weight")}</Label>} required>
                  <TextField placeholder={t("placeholders.weight")} />
                </FormField>
                <FormField label={<Label>{t("fields.height")}</Label>} required>
                  <TextField placeholder={t("placeholders.height")} />
                </FormField>
                <FormField label={<Label>{t("fields.skin")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.hair")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.eyes")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.hairType")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField
                    label={<Label>{t("fields.partnerAbout")}</Label>}
                    hint={t("hints.serious")}
                  >
                    <Textarea rows={5} placeholder="..." />
                  </FormField>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label={<Label>{t("fields.marriageType")}</Label>}
                  required
                >
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
                <FormField label={<Label>{t("fields.polygamyAgree")}</Label>}>
                  <Select
                    options={[{ value: "", label: t("placeholders.choose") }]}
                    placeholder={t("placeholders.choose")}
                  />
                </FormField>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-start gap-3 px-10 pb-10">
            <Button variant="secondary" onClick={prev} className="min-w-32">
              {t("buttons.prev")}
            </Button>
            <Button onClick={next} className="min-w-32">
              {step === steps.length - 1
                ? t("buttons.submit")
                : t("buttons.next")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
