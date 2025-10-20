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
import { useRouter } from "@/i18n/navigation";

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
  educationLevel: string;
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
  detailedProfile: string;
  preferredMinWeight: string | null;
  preferredMaxWeight: string | null;
  preferredMinHeight: string | null;
  preferredMaxHeight: string | null;
  preferredBodyColors: string[];
  preferredHairColors: string[];
  preferredEyeColors: string[];
  partnerPreferencesBio: string;
  marriageType: string;
  acceptPolygamy: boolean | null;
  polygamyStatus: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  preferredAgeFrom: number | null;
  preferredAgeTo: number | null;
  preferredNationality: string;
  preferredResidencePlace: string;
  preferredEducationLevel: string;
  preferredWorkNature: string;
  preferredMaritalStatus: string;
  preferredFinancialStatus: string;
  preferredHasHouse: boolean | null;
  preferredHealthStatus: string;
  preferredBeauty: string;
  preferredSkinColor: string;
  preferredReligiosityLevel: string;
  preferredAcceptPolygamy: string;
  preferredMarriageType: string;
};

type CountryData = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};

export default function EditProfilePage() {
  const t = useTranslations("request");
  const tEdit = useTranslations("profileEdit");
  const { profile, refreshProfile } = useAuth();
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState<"rtl" | "ltr">("ltr");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Countries and cities state
  const [countries, setCountries] = React.useState<CountryData[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = React.useState(false);


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
    educationLevel: "",
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
    detailedProfile: "",
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
    polygamyStatus: "",
    religiousPractice: "",
    sect: "",
    prayerLevel: "",
    preferredAgeFrom: null,
    preferredAgeTo: null,
    preferredNationality: "",
    preferredResidencePlace: "",
    preferredEducationLevel: "",
    preferredWorkNature: "",
    preferredMaritalStatus: "",
    preferredFinancialStatus: "",
    preferredHasHouse: null,
    preferredHealthStatus: "",
    preferredBeauty: "",
    preferredSkinColor: "",
    preferredReligiosityLevel: "",
    preferredAcceptPolygamy: "",
    preferredMarriageType: "",
  });

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
        detailedProfile: profile.detailedProfile || "",
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
        polygamyStatus: profile.polygamyStatus || "",
        religiousPractice: profile.religiousPractice || "",
        sect: profile.sect || "",
        prayerLevel: profile.prayerLevel || "",
        preferredAgeFrom: profile.preferredAgeFrom,
        preferredAgeTo: profile.preferredAgeTo,
        preferredNationality: profile.preferredNationality || "",
        preferredResidencePlace: profile.preferredResidencePlace || "",
        preferredEducationLevel: profile.preferredEducationLevel || "",
        preferredWorkNature: profile.preferredWorkNature || "",
        preferredMaritalStatus: profile.preferredMaritalStatus || "",
        preferredFinancialStatus: profile.preferredFinancialStatus || "",
        preferredHasHouse: profile.preferredHasHouse,
        preferredHealthStatus: profile.preferredHealthStatus || "",
        preferredBeauty: profile.preferredBeauty || "",
        preferredSkinColor: profile.preferredSkinColor || "",
        preferredReligiosityLevel: profile.preferredReligiosityLevel || "",
        preferredAcceptPolygamy: profile.preferredAcceptPolygamy || "",
        preferredMarriageType: profile.preferredMarriageType || "",
      });
    }
  }, [profile]);

  React.useEffect(() => {
    const d = document?.documentElement?.getAttribute("dir");
    if (d === "rtl" || d === "ltr") setDir(d);
  }, []);

  // Fetch countries on component mount
  React.useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries");
        const result = await response.json();
        if (!result.error) {
          setCountries(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update cities when country changes
  React.useEffect(() => {
    if (formData.location.country) {
      const selectedCountry = countries.find(
        country => country.country === formData.location.country || country.iso2 === formData.location.country
      );
      if (selectedCountry) {
        setCities(selectedCountry.cities);
        // Clear city if it's not in the new country's cities
        if (formData.location.city && !selectedCountry.cities.includes(formData.location.city)) {
          updateNestedField("location", "city", "");
        }
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData.location.country, countries]);

  // ... existing useEffects and functions ...

  const handleCountryChange = (value: string) => {
    updateNestedField("location", "country", value);
    // Clear city when country changes
    updateNestedField("location", "city", "");
  };

  // Convert countries to select options
  const countryOptions = React.useMemo(() =>
    countries.map(country => ({
      value: country.country,
      label: country.country
    }))
    , [countries]);

  // Convert cities to select options
  const cityOptions = React.useMemo(() =>
    cities.map(city => ({
      value: city,
      label: city
    }))
    , [cities]);


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

  const updateArrayField = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof FormData] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const saveCurrentStep = async () => {
    setLoading(true);
    setError(null);

    try {
      let dataToSend = {};

      // Step 0: Basic info
      if (step === 0) {
        dataToSend = {
          username: formData.username || null,
          dateOfBirth: formData.dateOfBirth || null,
          location: formData.location,
          origin: formData.origin || null,
          nationality: formData.nationality || null,
          placeOfResidence: formData.placeOfResidence || null,
          tribe: formData.tribe || null,
          maritalStatus: formData.maritalStatus || null,
          numberOfChildren: formData.numberOfChildren,
          profession: formData.profession || null,
        };
      }

      // Step 1: Personal details
      if (step === 1) {
        dataToSend = {
          educationLevel: formData.educationLevel || null,
          natureOfWork: formData.natureOfWork || null,
          financialStatus: formData.financialStatus || null,
          healthStatus: formData.healthStatus || null,
          religiosityLevel: formData.religiosityLevel || null,
          weight: formData.weight,
          height: formData.height,
          skinColor: formData.skinColor || null,
          beauty: formData.beauty || null,
          bodyColor: formData.bodyColor || null,
          hairColor: formData.hairColor || null,
          hairType: formData.hairType || null,
          eyeColor: formData.eyeColor || null,
          houseAvailable: formData.houseAvailable,
          bio: formData.bio || null,
        };
      }

      // Step 2: Partner preferences
      if (step === 2) {
        dataToSend = {
          preferredAgeFrom: formData.preferredAgeFrom,
          preferredAgeTo: formData.preferredAgeTo,
          preferredMinWeight: formData.preferredMinWeight,
          preferredMaxWeight: formData.preferredMaxWeight,
          preferredMinHeight: formData.preferredMinHeight,
          preferredMaxHeight: formData.preferredMaxHeight,
          preferredNationality: formData.preferredNationality || null,
          preferredResidencePlace: formData.preferredResidencePlace || null,
          preferredEducationLevel: formData.preferredEducationLevel || null,
          preferredWorkNature: formData.preferredWorkNature || null,
          preferredMaritalStatus: formData.preferredMaritalStatus || null,
          preferredFinancialStatus: formData.preferredFinancialStatus || null,
          preferredHasHouse: formData.preferredHasHouse,
          preferredHealthStatus: formData.preferredHealthStatus || null,
          preferredBeauty: formData.preferredBeauty || null,
          preferredSkinColor: formData.preferredSkinColor || null,
          preferredReligiosityLevel: formData.preferredReligiosityLevel || null,
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
          polygamyStatus: formData.polygamyStatus || null,
          religiousPractice: formData.religiousPractice || null,
          sect: formData.sect || null,
          prayerLevel: formData.prayerLevel || null,
          preferredAcceptPolygamy: formData.preferredAcceptPolygamy || null,
          preferredMarriageType: formData.preferredMarriageType || null,
        };
      }

      console.log('Data to send:', dataToSend); // Debug log to see what's being sent

      await api.put("/users/profile", dataToSend);

      if (refreshProfile) {
        await refreshProfile();
      }

      return true;

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        tEdit("saveErrorDefault")
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
        router.push("/home");
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
        <Image src="/photos/terms-bg.webp" alt={tEdit("bgAlt")} width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
        <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-2">
          <Card className="rounded-[32px] border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
            <CardHeader className="py-8 pb-2 md:pb-6 md:pt-10">
              <CardTitle className="text-start text-xl md:text-3xl font-extrabold text-[#1D1B23]">
                {tEdit("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 px-4 md:px-10 pb-10">
              <Stepper steps={steps} activeIndex={step} direction={dir} clickableSteps={true} onStepClick={(step)=>setStep(step)} />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Step 0: Basic Info */}
              {step === 0 && (
                <div className="max-w-3xl grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label={<Label>{t("fields.username")}</Label>}>
                    <TextField
                      value={formData.username}
                      onChange={(e) => updateField("username", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("dateOfBirth")}</Label>}>
                    <TextField
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    />
                  </FormField>
                  {/* Country Field */}
                  <FormField
                    label={<Label>{t("fields.country")}</Label>}
                    required
                  >
                    <Select
                      options={countryOptions}
                      value={formData.location.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      placeholder={loadingCountries ? tEdit("loading") : t("placeholders.choose")}
                      disabled={loadingCountries}
                    />
                  </FormField>

                  {/* City Field - Dependent on Country */}
                  <FormField label={<Label>{t("fields.city")}</Label>}>
                    <Select
                      options={cityOptions}
                      value={formData.location.city}
                      onChange={(e) => updateNestedField("location", "city", e.target.value)}
                      placeholder={
                        !formData.location.country
                          ? tEdit("selectCountryFirst")
                          : cities.length === 0
                            ? tEdit("noCitiesAvailable")
                            : t("placeholders.choose")
                      }
                      disabled={!formData.location.country || cities.length === 0}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.origin")}</Label>}>
                    <TextField
                      value={formData.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  {/* Nationality Field - Independent Select */}
                  <FormField label={<Label>{t("fields.nationality2")}</Label>}
                    required>
                    <Select
                      options={countryOptions}
                      value={formData.nationality}
                      onChange={(e) => updateField("nationality", e.target.value)}
                      placeholder={loadingCountries ? tEdit("loading") : t("placeholders.choose")}
                      disabled={loadingCountries}

                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.residence")}</Label>}>
                    <TextField
                      value={formData.placeOfResidence}
                      onChange={(e) => updateField("placeOfResidence", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.tribe")}</Label>}>
                    <Select
                      options={[
                        { value: "tribal", label: tEdit("tribal") },
                        { value: "non_tribal", label: tEdit("non_tribal") },
                      ]}
                      value={formData.tribe}
                      onChange={(e) => updateField("tribe", e.target.value)}
                      placeholder={t("placeholders.choose")}
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
                        { value: "married", label: tEdit("married") },
                      ]}
                      value={formData.maritalStatus}
                      onChange={(e) => updateField("maritalStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.children")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.numberOfChildren || ""}
                      onChange={(e) => updateField("numberOfChildren", e.target.value ? Number(e.target.value) : null)}
                      placeholder="0"
                    />
                  </FormField>
                </div>
              )}

              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label={<Label>{t("fields.education")}</Label>}>
                    <Select
                      options={[
                        { value: "student", label: tEdit("student") },
                        { value: "highSchool", label: tEdit("highSchool") },
                        { value: "bachelor", label: tEdit("bachelor") },
                        { value: "master", label: tEdit("master") },
                        { value: "doctorate", label: tEdit("doctorate") },
                      ]}
                      value={formData.educationLevel}
                      onChange={(e) => updateField("educationLevel", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.profession")}</Label>}>
                    <TextField
                      value={formData.profession}
                      onChange={(e) => updateField("profession", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.job")}</Label>}>
                    <Select
                      options={[
                        { value: "unemployed", label: tEdit("unemployed") },
                        { value: "employed", label: tEdit("employed") },
                        { value: "self_employed", label: tEdit("selfEmployed") },
                      ]}
                      value={formData.natureOfWork}
                      onChange={(e) => updateField("natureOfWork", e.target.value)}
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
                      value={formData.financialStatus}
                      onChange={(e) => updateField("financialStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.health")}</Label>}>
                    <Select
                      options={[
                        { value: "excellent", label: tEdit("excellent") },
                        { value: "good", label: tEdit("good") },
                        { value: "average", label: tEdit("average") },
                      ]}
                      value={formData.healthStatus}
                      onChange={(e) => updateField("healthStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.religiosity")}</Label>}>
                    <Select
                      options={[
                        { value: "committed", label: tEdit("practiceReligious") },
                        { value: "moderate", label: tEdit("practiceModerate") },
                        { value: "basic", label: tEdit("practiceBasic") },
                      ]}
                      value={formData.religiosityLevel}
                      onChange={(e) => updateField("religiosityLevel", e.target.value)}
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
                  <FormField label={<Label>{t("fields.skin")}</Label>}>
                    <Select
                      options={[
                        { value: "white", label: tEdit("white") },
                        { value: "lightWheat", label: tEdit("lightWheat") },
                        { value: "darkWheat", label: tEdit("darkWheat") },
                      ]}
                      value={formData.skinColor}
                      onChange={(e) => updateField("skinColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.beauty")}</Label>}>
                    <Select
                      options={[
                        { value: "handsome", label: tEdit("handsome") },
                        { value: "average", label: tEdit("average") },
                        { value: "good", label: tEdit("good") },
                      ]}
                      value={formData.beauty}
                      onChange={(e) => updateField("beauty", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.hair")}</Label>}>
                    <Select
                      options={[
                        { value: "black", label: tEdit("black") },
                        { value: "brown", label: tEdit("brown") },
                        { value: "blonde", label: tEdit("blonde") },
                      ]}
                      value={formData.hairColor}
                      onChange={(e) => updateField("hairColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.eyes")}</Label>}>
                    <Select
                      options={[
                        { value: "brown", label: tEdit("brown") },
                        { value: "black", label: tEdit("black") },
                        { value: "green", label: tEdit("green") },
                        { value: "blue", label: tEdit("blue") },
                      ]}
                      value={formData.eyeColor}
                      onChange={(e) => updateField("eyeColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.hairType")}</Label>}>
                    <Select
                      options={[
                        { value: "straight", label: tEdit("straight") },
                        { value: "wavy", label: tEdit("wavy") },
                        { value: "curly", label: tEdit("curly") },
                      ]}
                      value={formData.hairType}
                      onChange={(e) => updateField("hairType", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.home")}</Label>}>
                    <Select
                      options={[
                        { value: "true", label: tEdit("available") },
                        { value: "false", label: tEdit("notAvailable") },
                      ]}
                      value={formData.houseAvailable?.toString()}
                      onChange={(e) => updateField("houseAvailable", e.target.value === "true")}
                      placeholder={t("placeholders.choose")}
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
                        placeholder={t("placeholders.write")}
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {/* Step 2: Partner Preferences */}
              {step === 2 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label={<Label>{t("fields.preferredAgeFrom")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredAgeFrom || ""}
                      onChange={(e) => updateField("preferredAgeFrom", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("fields.preferredAgeFrom")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredAgeTo")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredAgeTo || ""}
                      onChange={(e) => updateField("preferredAgeTo", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("fields.preferredAgeTo")}
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("preferredWeightFrom")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMinWeight || ""}
                      onChange={(e) => updateField("preferredMinWeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.weight")}
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("preferredWeightTo")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMaxWeight || ""}
                      onChange={(e) => updateField("preferredMaxWeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.weight")}
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("preferredHeightFrom")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMinHeight || ""}
                      onChange={(e) => updateField("preferredMinHeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.height")}
                    />
                  </FormField>
                  <FormField label={<Label>{tEdit("preferredHeightTo")}</Label>}>
                    <TextField
                      type="number"
                      value={formData.preferredMaxHeight || ""}
                      onChange={(e) => updateField("preferredMaxHeight", e.target.value ? Number(e.target.value) : null)}
                      placeholder={t("placeholders.height")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredNationality")}</Label>}>
                    <TextField
                      value={formData.preferredNationality}
                      onChange={(e) => updateField("preferredNationality", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredResidence")}</Label>}>
                    <TextField
                      value={formData.preferredResidencePlace}
                      onChange={(e) => updateField("preferredResidencePlace", e.target.value)}
                      placeholder={t("placeholders.write")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredEducation")}</Label>}>
                    <Select
                      options={[
                        { value: "student", label: tEdit("student") },
                        { value: "highSchool", label: tEdit("highSchool") },
                        { value: "bachelor", label: tEdit("bachelor") },
                        { value: "master", label: tEdit("master") },
                        { value: "doctorate", label: tEdit("doctorate") },
                      ]}
                      value={formData.preferredEducationLevel}
                      onChange={(e) => updateField("preferredEducationLevel", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredWork")}</Label>}>
                    <Select
                      options={[
                        { value: "unemployed", label: tEdit("unemployed") },
                        { value: "employed", label: tEdit("employed") },
                        { value: "self_employed", label: tEdit("selfEmployed") },
                      ]}
                      value={formData.preferredWorkNature}
                      onChange={(e) => updateField("preferredWorkNature", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredMarital")}</Label>}>
                    <Select
                      options={[
                        { value: "single", label: tEdit("single") },
                        { value: "divorced", label: tEdit("divorced") },
                        { value: "widowed", label: tEdit("widowed") },
                      ]}
                      value={formData.preferredMaritalStatus}
                      onChange={(e) => updateField("preferredMaritalStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredFinancial")}</Label>}>
                    <Select
                      options={[
                        { value: "excellent", label: tEdit("excellent") },
                        { value: "good", label: tEdit("good") },
                        { value: "average", label: tEdit("average") },
                      ]}
                      value={formData.preferredFinancialStatus}
                      onChange={(e) => updateField("preferredFinancialStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredHouse")}</Label>}>
                    <Select
                      options={[
                        { value: "true", label: tEdit("available") },
                        { value: "false", label: tEdit("notAvailable") },
                      ]}
                      value={formData.preferredHasHouse?.toString()}
                      onChange={(e) => updateField("preferredHasHouse", e.target.value === "true")}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredHealth")}</Label>}>
                    <Select
                      options={[
                        { value: "excellent", label: tEdit("excellent") },
                        { value: "good", label: tEdit("good") },
                        { value: "average", label: tEdit("average") },
                      ]}
                      value={formData.preferredHealthStatus}
                      onChange={(e) => updateField("preferredHealthStatus", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredBeauty")}</Label>}>
                    <Select
                      options={[
                        { value: "handsome", label: tEdit("handsome") },
                        { value: "average", label: tEdit("average") },
                        { value: "good", label: tEdit("good") },
                      ]}
                      value={formData.preferredBeauty}
                      onChange={(e) => updateField("preferredBeauty", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredSkin")}</Label>}>
                    <Select
                      options={[
                        { value: "white", label: tEdit("white") },
                        { value: "lightWheat", label: tEdit("lightWheat") },
                        { value: "darkWheat", label: tEdit("darkWheat") },
                      ]}
                      value={formData.preferredSkinColor}
                      onChange={(e) => updateField("preferredSkinColor", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.preferredReligiosity")}</Label>}>
                    <Select
                      options={[
                        { value: "committed", label: "ملتزم" },
                        { value: "moderate", label: "متوسط" },
                        { value: "basic", label: "أساسي" },
                      ]}
                      value={formData.preferredReligiosityLevel}
                      onChange={(e) => updateField("preferredReligiosityLevel", e.target.value)}
                      placeholder={t("placeholders.choose")}
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
                        placeholder={t("placeholders.write")}
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {/* Step 3: Religious & Marriage Preferences */}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      onChange={(e) => updateField("marriageType", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.polygamyAgree")}</Label>}>
                    <Select
                      options={[
                        { value: "yes", label: tEdit("yes") },
                        { value: "no", label: tEdit("no") },
                      ]}
                      value={formData.acceptPolygamy?.toString()}
                      onChange={(e) => updateField("acceptPolygamy", e.target.value === "true")}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.religiousPractice")}</Label>}>
                    <Select
                      options={[
                        { value: "Religious", label: tEdit("practiceReligious") },
                        { value: "Moderate", label: tEdit("practiceModerate") },
                        { value: "Basic", label: tEdit("practiceBasic") },
                      ]}
                      value={formData.religiousPractice}
                      onChange={(e) => updateField("religiousPractice", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.sect")}</Label>}>
                    <Select
                      options={[
                        { value: "Sunni", label: tEdit("sunni") },
                        { value: "Shia", label: tEdit("shia") },
                      ]}
                      value={formData.sect}
                      onChange={(e) => updateField("sect", e.target.value)}
                      placeholder={t("placeholders.choose")}
                    />
                  </FormField>
                  <FormField label={<Label>{t("fields.prayer")}</Label>}>
                    <Select
                      options={[
                        { value: "Prays 5 times a day", label: tEdit("prays5") },
                        { value: "Sometimes", label: tEdit("sometimes") },
                        { value: "Rarely", label: tEdit("rarely") },
                      ]}
                      value={formData.prayerLevel}
                      onChange={(e) => updateField("prayerLevel", e.target.value)}
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
