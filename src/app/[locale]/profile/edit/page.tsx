"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { FormField } from "@/components/ui/form";
import Label from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Link, useRouter } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import countriesLib from "i18n-iso-countries";
// import enCountries from "i18n-iso-countries/langs/en.json";
// import arCountries from "i18n-iso-countries/langs/ar.json";

if (typeof window !== "undefined") {
  (async () => {
    try {
      const en = await import("i18n-iso-countries/langs/en.json");
      const ar = await import("i18n-iso-countries/langs/ar.json");
      countriesLib.registerLocale(en.default || en);
      countriesLib.registerLocale(ar.default || ar);
    } catch (err) {
      // fallback: try to require on server (shouldn't run in client file) or warn
      // console.warn("i18n-iso-countries locale load failed", err);
    }
  })();
}

type FormData = {
  username: string;
  dateOfBirth: string;
  age: number | null;
  location: {
    city: string;
    country: string;
  };
  origin: string;
  nationality: string;
  placeOfResidence: string;
  tribe: string;
  maritalStatus: string;
  numberOfChildren: number | null;
  profession: string;
  educationLevel: string | null;
  natureOfWork: string;
  financialStatus: string;
  healthStatus: string;
  religiosityLevel: string;
  weight: string | null;
  height: string | null;
  skinColor: string;
  beauty: string;
  bodyColor: string;
  hairColor: string;
  hairType: string;
  eyeColor: string;
  houseAvailable: boolean | null;
  bio: string;
  marriageType: string;
  acceptPolygamy: string | null;  // CHANGED
  polygamyStatus: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  hijab_style: string | null; // ensure nullable
};

// Define payload type (what we send)
type ProfileUpdatePayload = {
  username: string | null;
  dateOfBirth: string | null;
  location: { country: string | null; city: string | null };
  tribe: string | null;
  maritalStatus: string | null;
  educationLevel: string | null;
  natureOfWork: string | null;
  financialStatus: string | null;
  healthStatus: string | null;
  weight: string | number | null;
  height: string | number | null;
  skinColor: string | null;
  beauty: string | null;
  houseAvailable: boolean | null;
  bio: string | null;
  marriageType: string | null;
  religiosityLevel: string | null;
  // female only (optional)
  acceptPolygamy?: string | null;
  hijab_style?: string | null;
};

export default function EditProfilePage() {
  const t = useTranslations("request");
  const tEdit = useTranslations("profileEdit");
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const [success, setSuccess] = React.useState<boolean>(false);
  const locale = useLocale(); // "en" | "ar"
  const currentLocale = locale === "ar" ? "ar" : "en";

  // Countries and cities state
  // const [countries, setCountries] = React.useState<CountryData[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [loadingCountries] = React.useState(false);

  // Helper: normalize country name -> ISO2
  const toISO2 = React.useCallback((maybeName: string) => {
    if (!maybeName) return "";
    const trimmed = maybeName.trim();
    if (trimmed.length === 2 && /^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
    // Try both locales
    return (
      countriesLib.getAlpha2Code(trimmed, "en") ||
      countriesLib.getAlpha2Code(trimmed, "ar") ||
      ""
    );
  }, []);

  const [formData, setFormData] = React.useState<FormData>({
    username: "",
    dateOfBirth: "",
    age: null,
    location: { city: "", country: "" },
    origin: "",
    nationality: "",
    placeOfResidence: "",
    tribe: "",
    maritalStatus: "",
    numberOfChildren: null,
    profession: "",
    educationLevel: null,
    natureOfWork: "",
    financialStatus: "",
    healthStatus: "",
    religiosityLevel: "",
    weight: null,
    height: null,
    skinColor: "",
    beauty: "",
    bodyColor: "",
    hairColor: "",
    hairType: "",
    eyeColor: "",
    houseAvailable: null,
    bio: "",
    marriageType: "",
    polygamyStatus: "",
    religiousPractice: "",
    sect: "",
    prayerLevel: "",
    acceptPolygamy: null,          // now string | null
    hijab_style: null,
  });

  // Social contact validation function
  const validateSocialContacts = (text: string): string | null => {
    const socialPatterns = [
      /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      /whatsapp|واتساب|واتس اب/gi,
      /telegram|تلغرام|تليجرام/gi,
      /instagram|انستغرام|انستقرام/gi,
      /snapchat|سناب شات|سناب/gi,
      /facebook|فيسبوك|فيس بوك/gi,
      /twitter|تويتر|^x$/gi,
      /tiktok|تيك توك/gi,
      /@[a-zA-Z0-9_]+/g,
      /\b(add me|اضافني|اضيفني|تواصل معي|كلمني|راسلني)\b/gi,
      /https?:\/\/[^\s]+/g,
      /www\.[^\s]+/g,
    ];

    for (const pattern of socialPatterns) {
      if (pattern.test(text)) {
        return tEdit("socialContactError");
      }
    }
    return null;
  };

  // Initialize form data with profile data
  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        dateOfBirth: profile.dateOfBirth || "",
        age: profile.age,
        location: profile.location || { city: "", country: "" },
        origin: profile.origin || "",
        nationality: profile.nationality || "",
        placeOfResidence: profile.placeOfResidence || "",
        tribe: profile.tribe || "",
        maritalStatus: profile.maritalStatus || "",
        numberOfChildren: profile.numberOfChildren,
        profession: profile.profession || "",
        educationLevel: profile.educationLevel || "",
        natureOfWork: profile.natureOfWork || "",
        financialStatus: profile.financialStatus || "",
        healthStatus: profile.healthStatus || "",
        religiosityLevel: profile.religiosityLevel || "",
        weight: profile.weight,
        height: profile.height,
        skinColor: profile.skinColor || "",
        beauty: profile.beauty || "",
        bodyColor: profile.bodyColor || "",
        hairColor: profile.hairColor || "",
        hairType: profile.hairType || "",
        eyeColor: profile.eyeColor || "",
        houseAvailable: profile.houseAvailable,
        bio: profile.bio || "",
        marriageType: profile.marriageType || "",
        acceptPolygamy: profile.acceptPolygamy || "",  // CHANGED
        polygamyStatus: profile.polygamyStatus || "",
        religiousPractice: profile.religiousPractice || "",
        sect: profile.sect || "",
        prayerLevel: profile.prayerLevel || "",
        hijab_style: profile.hijab_style || "",
      });
    }
  }, [profile]);

  // Fetch countries on component mount
  // React.useEffect(() => {
  //   const fetchCountries = async () => {
  //     setLoadingCountries(true);
  //     try {
  //       const response = await fetch("https://countriesnow.space/api/v0.1/countries");
  //       const result = await response.json();
  //       if (!result.error) {
  //         setCountries(result.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch countries:", error);
  //     } finally {
  //       setLoadingCountries(false);
  //     }
  //   };

  //   fetchCountries();
  // }, []);

  // Build localized country options
  
  const countryOptions = React.useMemo(() => {
    const names = countriesLib.getNames(currentLocale, { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ value: code, label: name }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), currentLocale));
  }, [currentLocale]);

  const updateField = (field: string, value: any) => {
    // Validate social contacts for text fields
    if (field === 'bio' && typeof value === 'string') {
      const validationError = validateSocialContacts(value);
      if (validationError) {
        setError(validationError);
        return;
      } else {
        setError(null);
      }
    }

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

  const saveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData: ProfileUpdatePayload = {
        username: formData.username || null,
        dateOfBirth: formData.dateOfBirth || null,
        location: {
          country: formData.location.country, // send name; keep ISO2 internally
          city: formData.location.city,
        },
        tribe: formData.tribe || null,
        maritalStatus: formData.maritalStatus || null,
        educationLevel: formData.educationLevel || null,
        natureOfWork: formData.natureOfWork || null,
        financialStatus: formData.financialStatus || null,
        healthStatus: formData.healthStatus || null,
        weight: formData.weight,
        height: formData.height,
        skinColor: formData.skinColor || null,
        beauty: formData.beauty || null,
        houseAvailable: formData.houseAvailable,
        bio: formData.bio || null,
        marriageType: formData.marriageType || null,
        religiosityLevel: formData.religiosityLevel || null,
      };

      // Only add female-specific fields
      if (profile?.gender === "female") {
        profileData.acceptPolygamy = formData.acceptPolygamy || null;
        profileData.hijab_style = formData.hijab_style || null;
      };

      await api.put("/users/profile", profileData);
      if (refreshProfile) await refreshProfile();
      setSuccess(true);
      setTimeout(() => { router.push("/home"); }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || tEdit("saveErrorDefault"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className='relative pt-24 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'>
        <Image src="/photos/terms-bg.webp" alt={tEdit("bgAlt")} width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
        <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-2">
          <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
            {success ?
              <div className="flex flex-col items-center justify-center gap-6 py-20">
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_10532_13380)">
                    <circle cx="140" cy="136" r="120" fill="#F6F8FB" />
                  </g>
                  <g clipPath="url(#clip0_10532_13380)">
                    <path d="M140.5 226.5C190.206 226.5 230.5 186.206 230.5 136.5C230.5 86.7944 190.206 46.5 140.5 46.5C90.7944 46.5 50.5 86.7944 50.5 136.5C50.5 186.206 90.7944 226.5 140.5 226.5Z" fill="#32BA7C" />
                    <path d="M142.771 156.658C146.746 160.632 146.746 167.446 142.771 171.421L134.538 179.655C130.563 183.629 123.749 183.629 119.774 179.655L83.7174 143.314C79.7426 139.339 79.7426 132.525 83.7174 128.55L91.9508 120.317C95.9256 116.342 102.739 116.342 106.714 120.317L142.771 156.658Z" fill="white" />
                    <path d="M174.285 93.9108C178.26 89.936 185.074 89.936 189.049 93.9108L197.282 102.144C201.257 106.119 201.257 112.933 197.282 116.908L134.822 179.084C130.847 183.059 124.033 183.059 120.058 179.084L111.825 170.851C107.85 166.876 107.85 160.062 111.825 156.087L174.285 93.9108Z" fill="white" />
                  </g>
                  <defs>
                    <filter id="filter0_d_10532_13380">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="10" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.905882 0 0 0 0 0.933333 0 0 0 0 0.984314 0 0 0 0.15 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10532_13380" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10532_13380" result="shape" />
                    </filter>
                    <clipPath id="clip0_10532_13380">
                      <rect width="180" height="180" fill="white" transform="translate(50.5 46.5)" />
                    </clipPath>
                  </defs>
                </svg>
                <div className="text-center text-4xl text-[#111111]">{tEdit("saveSuccess")}</div>
              </div> : <>
                <CardHeader className="flex items-center gap-4 py-8 pb-2 md:pb-6 md:pt-10">
                  <Link href="/profile">
                    <ArrowRight size={30} className='ltr:hidden' /> <ArrowLeft size={30} className='rtl:hidden' />
                  </Link>
                  <CardTitle className="text-start text-xl md:text-3xl font-extrabold text-[#1D1B23]">
                    {tEdit("title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 px-4 md:px-10 pb-10">

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#301B69] border-b border-[#E5DDF7] pb-2">
                      {t("sections.basicInfo")}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField label={<Label>{t("fields.username")}</Label>} required>
                        <TextField
                          value={formData.username}
                          onChange={(e) => updateField("username", e.target.value)}
                          placeholder={t("placeholders.write")}
                          disabled={!!profile?.username}
                        />
                      </FormField>
                      <FormField label={<Label>{tEdit("dateOfBirth")}</Label>} required>
                        <TextField
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        />
                      </FormField>

                      {/* Country Field */}
                      <FormField label={<Label>{t("fields.nationality2")}</Label>} required>
                        <Select
                          options={countryOptions}
                          value={formData.location.country}
                          onChange={(val) => updateNestedField("location", "country", val)}
                          placeholder={t("placeholders.choose")}
                          disabled={loadingCountries}
                        />
                      </FormField>

                      {/* City Field - Dependent on Country */}
                      <FormField label={<Label>{t("fields.residence")}</Label>} required>
                        <Select
                          options={cities.map((city) => ({ value: city, label: city }))}
                          value={formData.location.city}
                          onChange={(val) => updateNestedField("location", "city", val)}
                          placeholder={
                            !formData.location.country
                              ? tEdit("selectCountryFirst")
                              : cities.length === 0
                                ? tEdit("noCitiesAvailable")
                                : t("placeholders.choose")
                          }
                        // disabled={!formData.location.country || cities.length === 0}
                        />
                      </FormField>

                      <FormField label={<Label>{t("fields.tribe")}</Label>} required>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "tribal", label: tEdit("f_tribal") },
                            { value: "non_tribal", label: tEdit("f_non_tribal") },
                            { value: "other", label: tEdit("other") },
                          ] : [
                            { value: "tribal", label: tEdit("tribal") },
                            { value: "non_tribal", label: tEdit("non_tribal") },
                            { value: "other", label: tEdit("other") },
                          ]}
                          value={formData.tribe}
                          onChange={(val) => updateField("tribe", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      <FormField
                        label={<Label>{t("fields.marital")}</Label>}
                        required
                      >
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "virgin", label: tEdit("virgin") },
                            { value: "f_divorced", label: tEdit("f_divorced") },
                            { value: "f_widowed", label: tEdit("f_widowed") },
                          ] : [
                            { value: "single", label: tEdit("single") },
                            { value: "divorced", label: tEdit("divorced") },
                            { value: "widowed", label: tEdit("widowed") },
                            { value: "married", label: tEdit("married") },
                          ]}
                          value={formData.maritalStatus}
                          onChange={(val) => updateField("maritalStatus", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#301B69] border-b border-[#E5DDF7] pb-2">
                      {t("sections.personalDetails")}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField label={<Label>{t("fields.health")}</Label>}>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "f_healthy", label: tEdit("f_healthy") },
                            { value: "f_chronically_ill", label: tEdit("chronically_ill") },
                            { value: "f_disabled", label: tEdit("f_disabled") },
                          ] : [
                            { value: "healthy", label: tEdit("healthy") },
                            { value: "chronically_ill", label: tEdit("chronically_ill") },
                            { value: "disabled", label: tEdit("disabled") },
                          ]}
                          value={formData.healthStatus}
                          onChange={(val) => updateField("healthStatus", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>
                      <FormField label={<Label>{t("fields.financial")}</Label>}>
                        <Select
                          options={[
                            { value: "excellent", label: tEdit("excellent") },
                            { value: "good", label: tEdit("good") },
                            { value: "average", label: tEdit("average") },
                          ]}
                          value={formData.financialStatus ?? undefined}
                          onChange={(val) => updateField("financialStatus", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>
                      <FormField label={<Label>{t("fields.religiosity")}</Label>}>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "f_normal", label: tEdit("f_normal") },
                            { value: "f_conservative", label: tEdit("f_conservative") },
                            { value: "f_committed", label: tEdit("f_committed") },
                          ] : [
                            { value: "normal", label: tEdit("normal") },
                            { value: "conservative", label: tEdit("conservative") },
                            { value: "committed", label: tEdit("committed") },
                          ]}
                          value={formData.religiosityLevel ?? undefined}
                          onChange={(val) => updateField("religiosityLevel", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>
                      <FormField label={<Label>{t("fields.education")}</Label>}>
                        <Select
                          options={[
                            { value: "secondary", label: tEdit("secondary") },
                            { value: "diploma", label: tEdit("diploma") },
                            { value: "university", label: tEdit("university") },
                            { value: "higher_education", label: tEdit("higher_education") },
                          ]}
                          value={formData.educationLevel ?? undefined}
                          onChange={(val) => updateField("educationLevel", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      <FormField label={<Label>{t("fields.job")}</Label>} required>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "f_unemployed", label: tEdit("f_unemployed") },
                            { value: "f_employed", label: tEdit("f_employed") },
                            { value: "self_employed", label: tEdit("selfEmployed") },
                          ] : [
                            { value: "unemployed", label: tEdit("unemployed") },
                            { value: "employed", label: tEdit("employed") },
                            { value: "self_employed", label: tEdit("selfEmployed") },
                          ]}
                          value={formData.natureOfWork}
                          onChange={(val) => updateField("natureOfWork", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

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

                      <FormField label={<Label>{t("fields.skin")}</Label>} required>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "f_white", label: tEdit("f_white") },
                            { value: "f_brown", label: tEdit("f_brown") },
                            { value: "f_black", label: tEdit("f_dark") },
                          ] : [
                            { value: "white", label: tEdit("white") },
                            { value: "brown", label: tEdit("brown") },
                            { value: "black", label: tEdit("dark") },
                          ]}
                          value={formData.skinColor}
                          onChange={(val) => updateField("skinColor", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      <FormField label={<Label>{t("fields.beauty")}</Label>} required>
                        <Select
                          options={profile?.gender === "female" ? [
                            { value: "f_acceptable", label: tEdit("f_acceptable") },
                            { value: "f_average", label: tEdit("f_average") },
                            { value: "f_beautiful", label: tEdit("f_beautiful") },
                            { value: "f_very_beautiful", label: tEdit("f_very_beautiful") }
                          ] : [
                            { value: "acceptable", label: tEdit("acceptable") },
                            { value: "average", label: tEdit("average") },
                            { value: "handsome", label: tEdit("handsome") }
                          ]}
                          value={formData.beauty}
                          onChange={(val) => updateField("beauty", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      <FormField label={<Label>{t("fields.home")}</Label>} required>
                        <Select
                          options={[
                            { value: "true", label: tEdit("available") },
                            { value: "false", label: tEdit("notAvailable") },
                          ]}
                          value={formData.houseAvailable?.toString()}
                          onChange={(val) => updateField("houseAvailable", val === "true")}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      <FormField
                        label={<Label>{t("fields.marriageType")}</Label>}
                        required
                      >
                        <Select
                          options={[
                            { value: "traditional", label: tEdit("traditional") },
                            { value: "civil", label: tEdit("civil") }
                          ]}
                          value={formData.marriageType}
                          onChange={(val) => updateField("marriageType", val)}
                          placeholder={t("placeholders.choose")}
                        />
                      </FormField>

                      {profile?.gender === "female" &&
                        <>
                          <FormField
                            label={<Label>{t("fields.acceptPolygamy")}</Label>}
                            required
                          >
                            <Select
                              options={[
                                { value: "yes", label: tEdit("yes") },
                                { value: "no", label: tEdit("no") },
                                { value: "thinking", label: tEdit("needToThink") },
                              ]}
                              value={formData.acceptPolygamy?.toString()}
                              onChange={(val) => updateField("acceptPolygamy", val)}
                              placeholder={t("placeholders.choose")}
                            />
                          </FormField>
                          <FormField
                            label={<Label>{t("fields.hijab_style")}</Label>}
                            required
                          >
                            <Select
                              options={[
                                { value: "niqab", label: tEdit("niqab") },
                                { value: "hijab", label: tEdit("veiled") },
                                { value: "no_hijab", label: tEdit("unveiled") }
                              ]}
                              value={formData.hijab_style?.toString()}
                              onChange={(val) => updateField("hijab_style", val)}
                              placeholder={t("placeholders.choose")}
                            />
                          </FormField>
                        </>
                      }
                    </div>

                    <div>
                      <FormField
                        label={<Label>{t("fields.about")}</Label>}
                        hint={t("hints.serious")}
                        error={error && error.includes("socialContactError") ? error : null}
                      >
                        <Textarea
                          rows={5}
                          value={formData.bio}
                          onChange={(val) => updateField("bio", val)}
                          placeholder={t("placeholders.write")}
                          className={error && error.includes("socialContactError") ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormField>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-start gap-3 px-10 pb-10">
                  <Button onClick={saveProfile} disabled={loading} className="min-w-32">
                    {loading ? tEdit("saving") : tEdit("saveProfile")}
                  </Button>
                </CardFooter>
              </>}
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}