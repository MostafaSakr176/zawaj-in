"use client";
import IdCard from '@/components/shared/IdCard';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axiosClient';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext'; // Add this import
import { useTranslations } from 'next-intl';
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

type User = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  location: { city: string; country: string };
  origin: string | null;
  nationality: string | null;
  placeOfResidence: string | null;
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
  country: string;
  maritalStatus: string;
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
};

type CountryData = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};

type CountriesResponse = {
  error: boolean;
  msg: string;
  data: CountryData[];
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

  // Countries and cities state
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const { profile } = useAuth();
  const { isConnected, onlineUsers } = useSocket(); // Add this line
  const t = useTranslations("home");
  const tEdit = useTranslations("profileEdit");
  const tRequest = useTranslations("request");

  // Filter state
  const [filters, setFilters] = useState<FilterData>({
    minAge: null,
    maxAge: null,
    city: "",
    country: "",
    maritalStatus: "",
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
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch countries and cities data
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data: CountriesResponse = await response.json();
        if (!data.error) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update cities when country changes
  useEffect(() => {
    if (filters.country) {
      const selectedCountry = countries.find(
        country => country.country.toLowerCase() === filters.country.toLowerCase()
      );

      if (selectedCountry) {
        setAvailableCities(selectedCountry.cities);
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
      // Clear city when country is cleared
      if (filters.city) {
        updateFilter("city", "");
      }
    }
  }, [filters.country, countries]);

  const updateFilter = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle country selection
  const handleCountryChange = (value: string) => {
    updateFilter("country", value);
    // Clear city selection when country changes
    updateFilter("city", "");
  };

  // Build query parameters from filters
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Required params
    params.append('limit', pagination.limit.toString());
    params.append('page', pagination.page.toString());
    params.append('gender', profile?.gender === "male" ? "female" : "male");

    // Optional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
        params.append(key, value.toString());
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
  }, [pagination.page, profile]);

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
    });
    fetchUsers(1);
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
                  src={profile?.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                  alt={"avatar"}
                  width={80}
                  height={80}
                  className="rounded-full w-12 h-12 md:w-20 md:h-20 object-cover"
                />
                {true && (
                  <span className="absolute top-0 left-0 md:top-1 md:left-1 w-3 h-3 rounded-full bg-[#2DC653] ring-3 ring-white" />
                )}
              </div>
              <div>
                <div className="text-[#301B69] text-base md:text-2xl">{t("welcome")}</div>
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
                        options={[
                          { value: "", label: t("all") },
                          ...countries.map(country => ({
                            value: country.country,
                            label: country.country
                          }))
                        ]}
                        value={filters.country}
                        onChange={(val) => handleCountryChange(val)}
                        placeholder={tRequest("placeholders.choose")}
                        disabled={loadingCountries}
                      />
                    </FormField>

                    {/* City Select - dependent on country */}
                    <FormField label={<Label>{tRequest("fields.residence")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
                          ...availableCities.map(city => ({
                            value: city,
                            label: city
                          }))
                        ]}
                        value={filters.city}
                        onChange={(val) => updateFilter("city", val)}
                        placeholder={
                          !filters.country
                            ? tRequest("placeholders.selectCountryFirst")
                            : availableCities.length === 0
                              ? tRequest("placeholders.noCitiesAvailable")
                              : tRequest("placeholders.choose")
                        }
                        disabled={!filters.country || availableCities.length === 0}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.marital")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
                          { value: "single", label: tEdit("single") },
                          { value: "divorced", label: tEdit("divorced") },
                          { value: "widowed", label: tEdit("widowed") },
                        ]}
                        value={filters.maritalStatus}
                        onChange={(val) => updateFilter("maritalStatus", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.education")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
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
                        options={[
                          { value: "", label: t("all") },
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
                        options={[
                          { value: "", label: t("all") },
                          { value: "white", label: tEdit("white") },
                          { value: "lightWheat", label: tEdit("lightWheat") },
                          { value: "darkWheat", label: tEdit("darkWheat") },
                        ]}
                        value={filters.skinColor}
                        onChange={(val) => updateFilter("skinColor", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.beauty")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
                          { value: "handsome", label: tEdit("handsome") },
                          { value: "average", label: tEdit("average") },
                          { value: "good", label: tEdit("good") },
                        ]}
                        value={filters.beauty}
                        onChange={(val) => updateFilter("beauty", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.marriageType")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
                          { value: "traditional", label: tEdit("traditional") },
                          { value: "civil", label: tEdit("civil") }
                        ]}
                        value={filters.marriageType}
                        onChange={(val) => updateFilter("marriageType", val)}
                        placeholder={tRequest("placeholders.choose")}
                      />
                    </FormField>
                    <FormField label={<Label>{tRequest("fields.home")}</Label>}>
                      <Select
                        options={[
                          { value: "", label: t("all") },
                          { value: "true", label: tEdit("available") },
                          { value: "false", label: tEdit("notAvailable") },
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
                    avatar={user.gender === "female" ? "/icons/female-img.webp" : "/photos/male-icon.png"}
                    age={user.age}
                    city={user?.location?.city}
                    job={user?.natureOfWork}
                    marriageType={user?.marriageType}
                    skinColor={user?.bodyColor}
                    status={user?.maritalStatus}
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