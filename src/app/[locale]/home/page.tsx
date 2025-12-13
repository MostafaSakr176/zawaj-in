"use client";
import IdCard from '@/components/shared/IdCard';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useTranslations, useLocale } from 'next-intl'; // <-- add useLocale
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from "@/components/ui/form";
import Label from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";

import countriesData from "@/lib/countries.json";
import citiesData from "@/lib/cities.json";

type User = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  location: { city: string; country: string };
  origin: string | null;
  nationality: string;
  placeOfResidence: string;
  tribe: string | null;
  maritalStatus: string;
  numberOfChildren: number | null;
  profession: string | null;
  educationLevel: string | null;
  natureOfWork: string | null;
  financialStatus: string | null;
  healthStatus: string | null;
  religiosityLevel: string | null;
  weight: string | null;
  height: string | null;
  skinColor: string | null;
  beauty: string | null;
  bodyColor: string | null;
  hairColor: string | null;
  hairType: string | null;
  eyeColor: string | null;
  houseAvailable: boolean | null;
  bio: string | null;
  marriageType: string | null;
  acceptPolygamy: boolean | null;
  religiousPractice: string | null;
  sect: string | null;
  prayerLevel: string | null;
  hasLiked?: boolean;
  isOnline?: boolean;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type FilterData = {
  minAge: number | null;
  maxAge: number | null;
  city: string;
  country: string; // store ISO2 here to match Edit Profile
  maritalStatus: string;
  nationality: string;
  placeOfResidence: string;
  skinColor: string;
  beauty: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  bodyColor: string;
  hairColor: string;
  hairType: string;
  eyeColor: string;
  marriageType: string;
  houseAvailable: boolean | null;
  acceptPolygamy: boolean | null;
  natureOfWork: string;
  educationLevel: string;
  financialStatus: string;
  healthStatus: string;
  religiosityLevel: string;
  hijabStyle?: string; // add to support female-specific filter
};

const MyFavorites = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 1,
  });

  const { profile } = useAuth();
  const { isConnected, onlineUsers } = useSocket(); // Add this line
  const t = useTranslations("home");
  const tEdit = useTranslations("profileEdit");
  const tRequest = useTranslations("request");
  const locale = useLocale();
  const currentLocale = locale === "ar" ? "ar" : "en";

  // Build nationality options from countries.json
  const nationalityOptions = React.useMemo(() => {
    return countriesData.map((c: any) => ({
      value: c.code,
      label: currentLocale === "ar" ? c.ar : c.en
    }));
  }, [currentLocale]);

  // Build placeOfResidence options from cities.json
  const placeOfResidenceOptions = React.useMemo(() => {
    return citiesData.map((city: any) => ({
      value: city.code,
      label: currentLocale === "ar" ? city.ar : city.en
    }));
  }, [currentLocale]);

  function getNationalityLabel(code: string, locale: string) {
  const item = countriesData.find((c: any) => c.code === code);
  return item ? (locale === "ar" ? item.ar : item.en) : code;
}

function getPlaceOfResidenceLabel(code: string, locale: string) {
  const item = citiesData.find((city: any) => city.code === code);
  return item ? (locale === "ar" ? item.ar ?? item.en : item.en) : code;
}

// Helper function to normalize Arabic values to English keys
// Also handles cases where API returns English keys directly (including f_ prefixed values)
function normalizeToEnglishKey(value: string, field: string, userGender?: string): string {
  const isFemale = userGender === "female" || userGender === "أنثى";
  
  // If value already starts with f_ or is a known English key, return as-is
  // This handles cases where API returns English keys directly
  if (value.startsWith('f_') || 
      ['single', 'divorced', 'widowed', 'married', 'virgin', 
       'unemployed', 'employed', 'self_employed',
       'white', 'brown', 'black',
       'traditional', 'mesyar', 'civil',
       'acceptable', 'average', 'handsome', 'beautiful', 'very_beautiful'].includes(value)) {
    return value;
  }
  
  // Marital status mappings
  if (field === 'maritalStatus') {
    const maleMap: { [key: string]: string } = {
      'أعزب': 'single',
      'مطلق': 'divorced',
      'أرمل': 'widowed',
      'متزوج': 'married',
    };
    const femaleMap: { [key: string]: string } = {
      'بكر': 'virgin',
      'مطلقة': 'f_divorced',
      'أرملة': 'f_widowed',
      'متزوجة': 'married',
    };
    if (isFemale && femaleMap[value]) return femaleMap[value];
    if (maleMap[value]) return maleMap[value];
  }
  
  // Nature of work mappings
  if (field === 'natureOfWork') {
    const maleMap: { [key: string]: string } = {
      'عاطل': 'unemployed',
      'موظف': 'employed',
      'صاحب عمل': 'self_employed'
    };
    const femaleMap: { [key: string]: string } = {
      'عاطلة': 'f_unemployed',
      'موظفة': 'f_employed',
      'صاحبة عمل': 'self_employed'
    };
    if (isFemale && femaleMap[value]) return femaleMap[value];
    if (maleMap[value]) return maleMap[value];
  }
  
  // Skin color mappings
  if (field === 'skinColor') {
    const maleMap: { [key: string]: string } = {
      'أبيض': 'white',
      'بني': 'brown',
      'أسود': 'black'
    };
    const femaleMap: { [key: string]: string } = {
      'بيضاء': 'f_white',
      'بنية': 'f_brown',
      'سمراء': 'f_black'
    };
    if (isFemale && femaleMap[value]) return femaleMap[value];
    if (maleMap[value]) return maleMap[value];
  }
  
  // Marriage type mappings
  if (field === 'marriageType') {
    const map: { [key: string]: string } = {
      'تقليدي': 'traditional',
      'مسيار': 'mesyar'
    };
    if (map[value]) return map[value];
  }
  
  // Beauty mappings
  if (field === 'beauty') {
    const maleMap: { [key: string]: string } = {
      'مقبول': 'acceptable',
      'متوسط': 'average',
      'وسيم': 'handsome'
    };
    const femaleMap: { [key: string]: string } = {
      'مقبولة': 'f_acceptable',
      'متوسطة': 'f_average',
      'جميلة': 'f_beautiful',
      'جميلة جدا': 'f_very_beautiful'
    };
    if (isFemale && femaleMap[value]) return femaleMap[value];
    if (maleMap[value]) return maleMap[value];
  }
  
  return value; // Return as-is if no mapping found
}

// Translation functions for user data fields
function translateMaritalStatus(value: string | null, locale: string, tEdit: any, userGender?: string): string | null {
  if (!value) return null;
  
  // Normalize Arabic values to English keys
  const normalizedValue = normalizeToEnglishKey(value, 'maritalStatus', userGender);
  const isFemale = userGender === "female" || userGender === "أنثى";
  
  const translations: { [key: string]: string } = {
    "single": tEdit("single"),
    "divorced": isFemale ? tEdit("f_divorced") : tEdit("divorced"),
    "widowed": isFemale ? tEdit("f_widowed") : tEdit("widowed"),
    "married": tEdit("married"),
    "virgin": tEdit("virgin"),
    "f_divorced": tEdit("f_divorced"),
    "f_widowed": tEdit("f_widowed"),
  };
  
  return translations[normalizedValue] || value;
}

function translateNatureOfWork(value: string | null, locale: string, tEdit: any, userGender?: string): string | null {
  if (!value) return null;
  
  // Normalize Arabic values to English keys
  const normalizedValue = normalizeToEnglishKey(value, 'natureOfWork', userGender);
  const isFemale = userGender === "female" || userGender === "أنثى";
  
  const translations: { [key: string]: string } = {
    "unemployed": isFemale ? tEdit("f_unemployed") : tEdit("unemployed"),
    "employed": isFemale ? tEdit("f_employed") : tEdit("employed"),
    "self_employed": tEdit("selfEmployed"),
    "f_unemployed": tEdit("f_unemployed"),
    "f_employed": tEdit("f_employed"),
  };
  
  return translations[normalizedValue] || value;
}

function translateSkinColor(value: string | null, locale: string, tEdit: any, userGender?: string): string | null {
  if (!value) return null;
  
  // Normalize Arabic values to English keys
  const normalizedValue = normalizeToEnglishKey(value, 'skinColor', userGender);
  const isFemale = userGender === "female" || userGender === "أنثى";
  
  const translations: { [key: string]: string } = {
    "white": isFemale ? tEdit("f_white") : tEdit("white"),
    "brown": isFemale ? tEdit("f_brown") : tEdit("brown"),
    "black": isFemale ? tEdit("f_dark") : tEdit("dark"),
    "f_white": tEdit("f_white"),
    "f_brown": tEdit("f_brown"),
    "f_black": tEdit("f_dark"),
  };
  
  return translations[normalizedValue] || value;
}

function translateMarriageType(value: string | null, locale: string, tEdit: any): string | null {
  if (!value) return null;
  
  // Normalize Arabic values to English keys
  const normalizedValue = normalizeToEnglishKey(value, 'marriageType');
  
  const translations: { [key: string]: string } = {
    "traditional": tEdit("traditional"),
    "mesyar": tEdit("civil"),
  };
  
  return translations[normalizedValue] || value;
}

function translateBeauty(value: string | null, locale: string, tEdit: any, userGender?: string): string | null {
  if (!value) return null;
  
  // Normalize Arabic values to English keys
  const normalizedValue = normalizeToEnglishKey(value, 'beauty', userGender);
  const isFemale = userGender === "female" || userGender === "أنثى";
  
  const translations: { [key: string]: string } = {
    "acceptable": isFemale ? tEdit("f_acceptable") : tEdit("acceptable"),
    "average": isFemale ? tEdit("f_average") : tEdit("average"),
    "handsome": tEdit("handsome"),
    "f_acceptable": tEdit("f_acceptable"),
    "f_average": tEdit("f_average"),
    "f_beautiful": tEdit("f_beautiful"),
    "f_very_beautiful": tEdit("f_very_beautiful"),
  };
  
  return translations[normalizedValue] || value;
}

  // Filter state
  const [filters, setFilters] = useState<FilterData>({
    minAge: null,
    maxAge: null,
    city: "",
    country: "", // ISO2
    maritalStatus: "",
    nationality: "",
    placeOfResidence: "",
    skinColor: "",
    beauty: "",
    religiousPractice: "",
    sect: "",
    prayerLevel: "",
    minHeight: null,
    maxHeight: null,
    minWeight: null,
    maxWeight: null,
    bodyColor: "",
    hairColor: "",
    hairType: "",
    eyeColor: "",
    marriageType: "",
    houseAvailable: null,
    acceptPolygamy: null,
    natureOfWork: "",
    educationLevel: "",
    financialStatus: "",
    healthStatus: "",
    religiosityLevel: "",
    hijabStyle: "",
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const updateFilter = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handle country change (independent; city not cleared)
  const handleCountryChange = (iso2: string) => {
    updateFilter("country", iso2);
  };

  // Build query params aligned with Edit Profile values
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Required params
    params.append('limit', pagination.limit.toString());
    params.append('page', pagination.page.toString());
    params.append('gender', profile?.gender === "male" || profile?.gender === "ذكر" ? "female" : "male");


    // Append other filters (skip empty/null)
    const entries = { ...filters }; // already handled
    Object.entries(entries).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
        params.append(key, String(value));
      }
    });

    return params.toString();
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const res = await api.get(`/users?${queryParams}`);
      setUsers(res.data.data.users || []);
      setPagination(res.data.data.pagination || { page, limit: pagination.limit, total: 0, totalPages: 1 });
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, profile, filters]);

  // useEffect(() => {
  //   fetchUsers(1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filters]);

  const handlePrev = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchUsers(1);
    setIsSheetOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      minAge: null,
      maxAge: null,
      city: "",
      country: "",
      maritalStatus: "",
      nationality: "",
      placeOfResidence: "",
      skinColor: "",
      beauty: "",
      religiousPractice: "",
      sect: "",
      prayerLevel: "",
      minHeight: null,
      maxHeight: null,
      minWeight: null,
      maxWeight: null,
      bodyColor: "",
      hairColor: "",
      hairType: "",
      eyeColor: "",
      marriageType: "",
      houseAvailable: null,
      acceptPolygamy: null,
      natureOfWork: "",
      educationLevel: "",
      financialStatus: "",
      healthStatus: "",
      religiosityLevel: "",
      hijabStyle: "",
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    setIsSheetOpen(false);
  };

  // Function to check if user is online
  const isUserOnline = (userId: string) => {
    const user = onlineUsers.get(userId);
    return user?.isOnline || false;
  };

  // Update users with online status
  const usersWithOnlineStatus = users.filter(user => user.gender !== profile?.gender).map(user => ({
    ...user,
    isOnline: isUserOnline(user.id)
  }));

  return (
    <ProtectedRoute>
      <div className="relative pt-24 md:pt-36 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]">
        <Image
          src="/photos/terms-bg.webp"
          alt="Terms Background"
          width={100}
          height={100}
          className="absolute w-full inset-x-0 top-0 z-1"
        />

        <div
          className="max-w-7xl mx-auto px-4 relative z-2 rounded-3xl p-3 shadow-lg"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 255, 255, 0.256) 100%)',
          }}
        >
          {/* Add connection status indicator */}
          {/* <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Array.from(onlineUsers.values()).filter(u => u.isOnline).length} users online
            </div>
          </div> */}

          <div
            className="p-2 mb-4 flex items-center justify-between rounded-3xl border border-[#EAECF0]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.24) 100%)"
            }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={profile?.gender === "female" || profile?.gender === "أنثى" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                  alt={"avatar"}
                  width={80}
                  height={80}
                  className="rounded-full w-12 h-12 md:w-20 md:h-20 object-cover"
                />
                {profile?.isOnline && (
                  <span className="absolute top-0 left-0 md:top-1 md:left-1 w-3 h-3 rounded-full bg-[#2DC653] ring-3 ring-white" />
                )}
              </div>
              <div>
                <div className="text-[#301B69] text-base md:text-2xl">{ profile?.gender === "female" || profile?.gender === "أنثى" ? t("f_welcome") : t("welcome")}</div>
                <div className="flex items-center justify-end gap-1">
                  <h4 className="text-lg md:text-3xl font-semibold text-[#301B69] leading-none">
                    {profile?.fullName || "User"}
                  </h4>
                  {profile?.isVerified && <Image src={"/icons/virify.webp"} alt="virify" width={16} height={16} />}
                </div>
              </div>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Filter size={20} />
                  {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className="w-full md:w-[500px] flex flex-col h-full">
                <SheetHeader className="flex-shrink-0 px-6 pb-4">
                  <SheetTitle>{t("filterUsers")}</SheetTitle>
                </SheetHeader>

                {/* Scrollable Form Fields */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  {/* Age Range */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label={<Label>{tRequest("fields.preferredAgeFrom")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.minAge || ""}
                          onChange={(e) => updateFilter("minAge", e.target.value ? Number(e.target.value) : null)}
                          placeholder="18"
                        />
                      </FormField>
                      <FormField label={<Label>{tRequest("fields.preferredAgeTo")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.maxAge || ""}
                          onChange={(e) => updateFilter("maxAge", e.target.value ? Number(e.target.value) : null)}
                          placeholder="65"
                        />
                      </FormField>
                    </div>
                    <FormField label={<Label>{tRequest("fields.nationality")}</Label>}>
                      <Select
                        options={nationalityOptions}
                        value={filters.nationality}
                        onChange={(val) => updateFilter("nationality", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.residence")}</Label>}>
                      <Select
                        options={placeOfResidenceOptions}
                        value={filters.placeOfResidence}
                        onChange={(val) => updateFilter("placeOfResidence", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.marital")}</Label>}>
                      <Select
                          options={profile?.gender === "male" || profile?.gender === "ذكر" ? [
                            { value: "virgin", label: tEdit("virgin") },
                            { value: "f_divorced", label: tEdit("f_divorced") },
                            { value: "f_widowed", label: tEdit("f_widowed") },
                          ] : [
                            { value: "single", label: tEdit("single") },
                            { value: "divorced", label: tEdit("divorced") },
                            { value: "widowed", label: tEdit("widowed") },
                            { value: "married", label: tEdit("married") },
                          ]}
                        value={filters.maritalStatus}
                        onChange={(val) => updateFilter("maritalStatus", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.education")}</Label>}>
                      <Select
                        options={[
                          { value: "secondary", label: tEdit("secondary") },
                          { value: "diploma", label: tEdit("diploma") },
                          { value: "university", label: tEdit("university") },
                          { value: "higher_education", label: tEdit("higher_education") },
                        ]}
                        value={filters.educationLevel}
                        onChange={(val) => updateFilter("educationLevel", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.job")}</Label>}>
                      <Select
                          options={profile?.gender === "male" || profile?.gender === "ذكر" ? [
                            
                            { value: "f_unemployed", label: tEdit("f_unemployed") },
                            { value: "f_employed", label: tEdit("f_employed") },
                            { value: "self_employed", label: tEdit("selfEmployed") },
                          ] : [
                            
                            { value: "unemployed", label: tEdit("unemployed") },
                            { value: "employed", label: tEdit("employed") },
                            { value: "self_employed", label: tEdit("selfEmployed") },
                          ]}
                        value={filters.natureOfWork}
                        onChange={(val) => updateFilter("natureOfWork", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label={<Label>{t("minHeight")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.minHeight || ""}
                          onChange={(e) => updateFilter("minHeight", e.target.value ? Number(e.target.value) : null)}
                          placeholder="150"
                        />
                      </FormField>
                      <FormField label={<Label>{t("maxHeight")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.maxHeight || ""}
                          onChange={(e) => updateFilter("maxHeight", e.target.value ? Number(e.target.value) : null)}
                          placeholder="200"
                        />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label={<Label>{t("minWeight")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.minWeight || ""}
                          onChange={(e) => updateFilter("minWeight", e.target.value ? Number(e.target.value) : null)}
                          placeholder="40"
                        />
                      </FormField>
                      <FormField label={<Label>{t("maxWeight")}</Label>}>
                        <TextField
                          type="number"
                          value={filters.maxWeight || ""}
                          onChange={(e) => updateFilter("maxWeight", e.target.value ? Number(e.target.value) : null)}
                          placeholder="120"
                        />
                      </FormField>
                    </div>
                    <FormField label={<Label>{tRequest("fields.skin")}</Label>}>
                        <Select
                          options={profile?.gender === "male" || profile?.gender === "ذكر" ? [
                            
                            { value: "f_white", label: tEdit("f_white") },
                            { value: "f_brown", label: tEdit("f_brown") },
                            { value: "f_black", label: tEdit("f_dark") },
                          ] : [
                            
                            { value: "white", label: tEdit("white") },
                            { value: "brown", label: tEdit("brown") },
                            { value: "black", label: tEdit("dark") },
                          ]}
                        value={filters.skinColor}
                        onChange={(val) => updateFilter("skinColor", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.beauty")}</Label>}>
                      <Select
                          options={profile?.gender === "male" || profile?.gender === "ذكر" ? [
                            { value: "f_acceptable", label: tEdit("f_acceptable") },
                            { value: "f_average", label: tEdit("f_average") },
                            { value: "f_beautiful", label: tEdit("f_beautiful") },
                            { value: "f_very_beautiful", label: tEdit("f_very_beautiful") }
                          ] : [
                            
                            { value: "acceptable", label: tEdit("acceptable") },
                            { value: "average", label: tEdit("average") },
                            { value: "handsome", label: tEdit("handsome") }
                          ]}
                        value={filters.beauty}
                        onChange={(val) => updateFilter("beauty", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.marriageType")}</Label>}>
                      <Select
                        options={[
                          { value: "traditional", label: tEdit("traditional") },
                          { value: "mesyar", label: tEdit("civil") }
                        ]}
                        value={filters.marriageType}
                        onChange={(val) => updateFilter("marriageType", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.home")}</Label>}>
                      <Select
                        options={[
                          { value: "true", label: tEdit("available") },
                          { value: "false", label: tEdit("notAvailable")},
                        ]}
                        value={filters.houseAvailable?.toString() || ""}
                        onChange={(val) => updateFilter("houseAvailable", val === "" ? null : val === "true")}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Static Action Buttons at Bottom */}
                <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-white">
                  <div className="flex gap-3">
                    <Button onClick={clearFilters} variant="secondary" className="flex-1">
                      {t("clearFilters")}
                    </Button>
                    <Button onClick={applyFilters} className="flex-1">
                      {t("applyFilters")}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="text-center py-12 text-lg text-[#301B69]">{t("loadingRecommendations")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {usersWithOnlineStatus.length === 0 ? (
                <div className="col-span-full text-center text-[#301B69] py-8">
                  {t("noRecommendations")}
                </div>
              ) : (
                usersWithOnlineStatus.map((user) => (
                  <IdCard
                    key={user.id}
                    id={user.id}
                    isFav={user?.hasLiked}
                    name={user.fullName || "User"}
                    avatar={user.gender === "female" || user.gender === "أنثى" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                    age={user.age}
                    placeOfResidence={getPlaceOfResidenceLabel(user?.placeOfResidence, currentLocale) || ""}
                    nationality={getNationalityLabel(user?.nationality, currentLocale) || ""}
                    job={translateNatureOfWork(user?.natureOfWork, currentLocale, tEdit, user.gender)}
                    marriageType={translateMarriageType(user?.marriageType, currentLocale, tEdit)}
                    skinColor={translateSkinColor(user?.skinColor, currentLocale, tEdit, user.gender)}
                    status={translateMaritalStatus(user?.maritalStatus, currentLocale, tEdit, user.gender) || ""}
                    online={user?.isOnline} // This will now show real-time status
                  />
                ))
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-[#FFFFFF] text-[#344054] hover:bg-white transition disabled:opacity-50"
                onClick={handlePrev}
                disabled={pagination.page <= 1 || loading}
              >
                {t("prev")}
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-[#FFFFFF] text-[#344054] hover:bg-white transition disabled:opacity-50"
                onClick={handleNext}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                {t("next")}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8A97AB] text-sm">
                {t("pageInfo", { page: pagination.page, totalPages: pagination.totalPages })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyFavorites;