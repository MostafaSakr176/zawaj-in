"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosClient";

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
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

type FormData = {
  dateOfBirth: string;
  location: {
    city: string;
    country: string;
  };
  origin: string;
  maritalStatus: string;
  profession: string;
  weight: number | null;
  height: number | null;
  bodyColor: string;
  hairColor: string;
  hairType: string;
  eyeColor: string;
  houseAvailable: boolean | null;
  natureOfWork: string;
  bio: string;
  preferredMinWeight: number | null;
  preferredMaxWeight: number | null;
  preferredMinHeight: number | null;
  preferredMaxHeight: number | null;
  preferredBodyColors: string[];
  preferredHairColors: string[];
  preferredEyeColors: string[];
  partnerPreferencesBio: string;
  marriageType: string;
  acceptPolygamy: boolean | null;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
};

export default function EditProfilePage() {
  const t = useTranslations("request");
  const tEdit = useTranslations("profileEdit");
  const { profile, refreshProfile } = useAuth();
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState<"rtl" | "ltr">("ltr");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    dateOfBirth: "",
    location: { city: "", country: "" },
    origin: "",
    maritalStatus: "",
    profession: "",
    weight: null,
    height: null,
    bodyColor: "",
    hairColor: "",
    hairType: "",
    eyeColor: "",
    houseAvailable: null,
    natureOfWork: "",
    bio: "",
    preferredMinWeight: null,
    preferredMaxWeight: null,
    preferredMinHeight: null,
    preferredMaxHeight: null,
    preferredBodyColors: [],
    preferredHairColors: [],
    preferredEyeColors: [],
    partnerPreferencesBio: "",
    marriageType: "",
    acceptPolygamy: null,
    religiousPractice: "",
    sect: "",
    prayerLevel: "",
  });

  // Initialize form data with profile data
  React.useEffect(() => {
    if (profile) {
      setFormData({
        dateOfBirth: profile.dateOfBirth || "",
        location: profile.location || { city: "", country: "" },
        origin: profile.origin || "",
        maritalStatus: profile.maritalStatus || "",
        profession: profile.profession || "",
        weight: profile.weight,
        height: profile.height,
        bodyColor: profile.bodyColor || "",
        hairColor: profile.hairColor || "",
        hairType: profile.hairType || "",
        eyeColor: profile.eyeColor || "",
        houseAvailable: profile.houseAvailable,
        natureOfWork: profile.natureOfWork || "",
        bio: profile.bio || "",
        preferredMinWeight: profile.preferredMinWeight,
        preferredMaxWeight: profile.preferredMaxWeight,
        preferredMinHeight: profile.preferredMinHeight,
        preferredMaxHeight: profile.preferredMaxHeight,
        preferredBodyColors: profile.preferredBodyColors || [],
        preferredHairColors: profile.preferredHairColors || [],
        preferredEyeColors: profile.preferredEyeColors || [],
        partnerPreferencesBio: profile.partnerPreferencesBio || "",
        marriageType: profile.marriageType || "",
        acceptPolygamy: profile.acceptPolygamy,
        religiousPractice: profile.religiousPractice || "",
        sect: profile.sect || "",
        prayerLevel: profile.prayerLevel || "",
      });
    }
  }, [profile]);

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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof FormData] as object) || {}),
        [field]: value
      }
    }));
  };

  const saveCurrentStep = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let dataToSend = {};
      
      // Step 0: Basic info
      if (step === 0) {
        dataToSend = {
          dateOfBirth: formData.dateOfBirth || null,
          location: formData.location,
          origin: formData.origin || null,
          maritalStatus: formData.maritalStatus || null,
          profession: formData.profession || null,
        };
      }
      
      // Step 1: Personal details
      if (step === 1) {
        dataToSend = {
          weight: formData.weight,
          height: formData.height,
          bodyColor: formData.bodyColor || null,
          hairColor: formData.hairColor || null,
          hairType: formData.hairType || null,
          eyeColor: formData.eyeColor || null,
          houseAvailable: formData.houseAvailable,
          natureOfWork: formData.natureOfWork || null,
          bio: formData.bio || null,
        };
      }
      
      // Step 2: Partner preferences
      if (step === 2) {
        dataToSend = {
          preferredMinWeight: formData.preferredMinWeight,
          preferredMaxWeight: formData.preferredMaxWeight,
          preferredMinHeight: formData.preferredMinHeight,
          preferredMaxHeight: formData.preferredMaxHeight,
          preferredBodyColors: formData.preferredBodyColors.length > 0 ? formData.preferredBodyColors : null,
          preferredHairColors: formData.preferredHairColors.length > 0 ? formData.preferredHairColors : null,
          preferredEyeColors: formData.preferredEyeColors.length > 0 ? formData.preferredEyeColors : null,
          partnerPreferencesBio: formData.partnerPreferencesBio || null,
        };
      }
      
      // Step 3: Marriage preferences
      if (step === 3) {
        dataToSend = {
          marriageType: formData.marriageType || null,
          acceptPolygamy: formData.acceptPolygamy,
          religiousPractice: formData.religiousPractice || null,
          sect: formData.sect || null,
          prayerLevel: formData.prayerLevel || null,
        };
      }

      await api.put("/users/profile", dataToSend);
      
      if (refreshProfile) {
        await refreshProfile();
      }
      
      return true;
      
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        err?.message || 
        "حدث خطأ أثناء حفظ البيانات"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    const success = await saveCurrentStep();
    if (success) {
      if (step === steps.length - 1) {
        
      } else {
        setStep(s => Math.min(steps.length - 1, s + 1));
      }
    }
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12 text-lg text-[#301B69]">{tEdit("loading")}</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
        <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
        <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-2">
          <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
            <CardHeader className="py-8 pb-2 md:pb-6 md:pt-10">
              <CardTitle className="text-start text-xl md:text-3xl font-extrabold text-[#1D1B23]">
                {tEdit("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 px-4 md:px-10 pb-10">
              <Stepper steps={steps} activeIndex={step} direction={dir} />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {step === 0 && (
                <div className="max-w-3xl grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    label={<Label>{t("fields.nationality")}</Label>}
                    required
                  >
                    <Select
                      options={[
                        { value: "SA", label: tEdit("saudiArabia") },
                        { value: "EG", label: tEdit("egypt") },
                        { value: "UAE", label: tEdit("uae") },
                      ]} 
                      value={formData.location.country}
                      onChange={(e) => {updateNestedField("location", "country", e.target.value)}}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.city")}</Label>}>
                    <TextField
                      value={formData.location.city}
                      onChange={(e) => updateNestedField("location", "city", e.target.value)}
                      placeholder="المدينة"
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("dateOfBirth")}</Label>}>
                    <TextField
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.origin")}</Label>}>
                    <TextField
                      value={formData.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField
                    label={<Label>{t("fields.marital")}</Label>}
                    required
                  >
                    <Select
                      options={[
                        { value: "single", label: tEdit("single") },
                        { value: "divorced", label: tEdit("divorced") },
                        { value: "widowed", label: tEdit("widowed") },
                      ]}
                      value={formData.maritalStatus}
                      onChange={(e) => updateField("maritalStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.education")}</Label>}>
                    <TextField
                      value={formData.profession}
                      onChange={(e) => updateField("profession", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label={<Label>{t("fields.weight")}</Label>} required>
                    <TextField
                      type="number"
                      value={formData.weight || ""}
                      onChange={(e) => updateField("weight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.weight")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.height")}</Label>} required>
                    <TextField
                      type="number"
                      value={formData.height || ""}
                      onChange={(e) => updateField("height", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.height")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.skin")}</Label>}>
                    <Select
                      options={[
                        { value: "fair", label: tEdit("fair") },
                        { value: "medium", label: tEdit("medium") },
                        { value: "dark", label: tEdit("dark") },
                      ]}
                      value={formData.bodyColor}
                      onChange={(e) => updateField("bodyColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.hair")}</Label>}>
                    <Select
                      options={[
                        { value: "black", label: "أسود" },
                        { value: "brown", label: "بني" },
                        { value: "blonde", label: "أشقر" },
                      ]}
                      value={formData.hairColor}
                      onChange={(e) => updateField("hairColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.eyes")}</Label>}>
                    <Select
                      options={[
                        { value: "brown", label: "بني" },
                        { value: "black", label: "أسود" },
                        { value: "green", label: "أخضر" },
                        { value: "blue", label: "أزرق" },
                      ]}
                      value={formData.eyeColor}
                      onChange={(e) => updateField("eyeColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.hairType")}</Label>}>
                    <Select
                      options={[
                        { value: "straight", label: "مستقيم" },
                        { value: "wavy", label: "مموج" },
                        { value: "curly", label: "مجعد" },
                      ]}
                      value={formData.hairType}
                      onChange={(e) => updateField("hairType", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.home")}</Label>}>
                    <Select
                      options={[
                        { value: "true", label: "متوفر" },
                        { value: "false", label: "غير متوفر" },
                      ]}
                      value={formData.houseAvailable?.toString()}
                      onChange={(e) => updateField("houseAvailable", e.target.value === "true")}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.job")}</Label>}>
                    <TextField
                      value={formData.natureOfWork}
                      onChange={(e) => updateField("natureOfWork", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField
                      label={<Label>{t("fields.about")}</Label>}
                      hint={t("hints.serious")}
                    >
                      <Textarea
                        rows={5}
                        value={formData.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="..."
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label={<Label>الوزن المفضل (من)</Label>} required>
                    <TextField
                      type="number"
                      value={formData.preferredMinWeight || ""}
                      onChange={(e) => updateField("preferredMinWeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.weight")}
                    />
                  </FormField>
                  <FormField label={<Label>الوزن المفضل (إلى)</Label>} required>
                    <TextField
                      type="number"
                      value={formData.preferredMaxWeight || ""}
                      onChange={(e) => updateField("preferredMaxWeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.weight")}
                    />
                  </FormField>
                  <FormField label={<Label>الطول المفضل (من)</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMinHeight || ""}
                      onChange={(e) => updateField("preferredMinHeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.height")}
                    />
                  </FormField>
                  <FormField label={<Label>الطول المفضل (إلى)</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMaxHeight || ""}
                      onChange={(e) => updateField("preferredMaxHeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.height")}
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField
                      label={<Label>{t("fields.partnerAbout")}</Label>}
                      hint={t("hints.serious")}
                    >
                      <Textarea
                        rows={5}
                        value={formData.partnerPreferencesBio}
                        onChange={(e) => updateField("partnerPreferencesBio", e.target.value)}
                        placeholder="..."
                      />
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
                      options={[
                        { value: "traditional", label: "تقليدي" },
                        { value: "civil", label: "مسيار" },
                        { value: "both", label: "الاثنان معا" },
                      ]}
                      value={formData.marriageType}
                      onChange={(e) => updateField("marriageType", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.polygamyAgree")}</Label>}>
                    <Select
                      options={[
                        { value: "true", label: "نعم" },
                        { value: "false", label: "لا" },
                      ]}
                      value={formData.acceptPolygamy?.toString()}
                      onChange={(e) => updateField("acceptPolygamy", e.target.value === "true")}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-start gap-3 px-10 pb-10">
              {step > 0 && (
                <Button variant="secondary" onClick={prev} className="min-w-32">
                  {t("buttons.prev")}
                </Button>
              )}
              <Button onClick={next} disabled={loading} className="min-w-32">
                {loading
                  ? tEdit("saving")
                  : step === steps.length - 1
                  ? t("buttons.submit")
                  : t("buttons.next")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
