"use client";

import React, { useMemo } from "react";
import IdCard from "@/components/shared/IdCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Select from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { useTranslations } from "next-intl";

// Memoize static data outside the component for performance
const MALE_MEMBERS = [
	{
        id: "1",
		isFav: true,
		name: "أحمد",
		avatar: "/photos/male-icon.webp",
		age: 28,
		city: "الرياض",
		job: "teacher",
		marriageType: "normalMarriage",
		skinColor: "lightSkin",
		status: "single",
	},
	{
		id: "2",
		isFav: false,
		name: "محمد",
		avatar: "/photos/male-icon.webp",
		age: 32,
		city: "الدمام",
		job: "doctor",
		marriageType: "normalMarriage",
		skinColor: "darkSkin",
		status: "divorced",
	},
	{
		id: "3",
		isFav: true,
		name: "علي",
		avatar: "/photos/male-icon.webp",
		age: 30,
		city: "المدينة",
		job: "businessman",
		marriageType: "normalMarriage",
		skinColor: "mediumSkin",
		status: "single",
	},
];

const FEMALE_MEMBERS = [
	{
        id: "4",
		isFav: false,
		name: "فاطمة",
		avatar: "/icons/female-img.webp",
		age: 24,
		city: "جدة",
		job: "engineer",
		marriageType: "misyarMarriage",
		skinColor: "mediumSkin",
		status: "single",
	},
	{
        id: "5",
		isFav: true,
		name: "عائشة",
		avatar: "/icons/female-img.webp",
		age: 26,
		city: "مكة",
		job: "lawyer",
		marriageType: "temporaryMarriage",
		skinColor: "lightSkin",
		status: "single",
	},
	{
        id: "6",
		isFav: true,
		name: "خديجة",
		avatar: "/icons/female-img.webp",
		age: 22,
		city: "الطائف",
		job: "student",
		marriageType: "normalMarriage",
		skinColor: "lightSkin",
		status: "single",
	},
];

const ALL_MEMBERS = [
	...MALE_MEMBERS,
	...FEMALE_MEMBERS,
	// Add more as needed, or fetch from API
];

const countryOptions = [
	{ value: "sa", label: "السعودية" },
	{ value: "eg", label: "مصر" },
];

const cityOptions = [
	{ value: "riyadh", label: "الرياض" },
	{ value: "jeddah", label: "جدة" },
];

const marriageTypeOptions = [
	{ value: "normalMarriage", label: "زواج عادي" },
	{ value: "misyarMarriage", label: "زواج مسيار" },
];

const NewSubscribers = React.memo(() => {
	const t = useTranslations("filters");

	// Memoize rendered lists for performance
	const allCards = useMemo(
		() =>
			ALL_MEMBERS.map((props, idx) => <IdCard key={props.name + idx} {...props} />),
		[]
	);
	const maleCards = useMemo(
		() =>
			MALE_MEMBERS.map((props, idx) => <IdCard key={props.name + idx} {...props} />),
		[]
	);
	const femaleCards = useMemo(
		() =>
			FEMALE_MEMBERS.map((props, idx) => <IdCard key={props.name + idx} {...props} />),
		[]
	);

	return (
		<section
			id="subscriptions"
			className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16 rounded-3xl md:rounded-[48px]"
			style={{
				background: "linear-gradient(229.14deg, #F2EFFF -7.04%, #FFF1FE 121.07%)",
			}}
		>
			<h2 className="text-4xl lg:text-5xl font-bold text-[#301B69] leading-normal text-center mb-8">
				احدث الاعضاء الجدد
			</h2>

			<div className="max-w-5xl mx-auto">
				<Tabs defaultValue="all">
					<TabsList className="w-full my-10 md:mb-6 md:mt-0 flex gap-4 items-center justify-center flex-col-reverse md:flex-row">
						<div className="flex gap-1 items-center">
							<TabsTrigger value="all" className="!rounded-[15px]">
								{t("all")}
							</TabsTrigger>
							<TabsTrigger value="males" className="!rounded-[15px]">
								{t("males")}
							</TabsTrigger>
							<TabsTrigger value="females" className="!rounded-[15px]">
								{t("females")}
							</TabsTrigger>
						</div>
						<div className="flex items-center gap-2">
							<FormField required className="w-30">
								<Select
									className="bg-white/40"
									options={countryOptions}
									placeholder={t("country")}
								/>
							</FormField>
							<FormField required className="w-30">
								<Select
									className="bg-white/40"
									options={cityOptions}
									placeholder={t("city")}
								/>
							</FormField>
							<FormField required className="w-30">
								<Select
									className="bg-white/40"
									options={marriageTypeOptions}
									placeholder={t("marriageType")}
								/>
							</FormField>
						</div>
					</TabsList>

					<TabsContent value="all">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">{allCards}</div>
						<div className="h-px bg-[#301B6914] mt-6 mb-3" />
						<Pagination t={t} />
					</TabsContent>
					<TabsContent value="males">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{maleCards}</div>
						<div className="h-px bg-[#301B6914] mt-6 mb-3" />
						<Pagination t={t} />
					</TabsContent>
					<TabsContent value="females">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">{femaleCards}</div>
						<div className="h-px bg-[#301B6914] mt-6 mb-3" />
						<Pagination t={t} />
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
});

function Pagination({ t }: { t: (key: string) => string }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
					{t("prev")}
				</button>
				<button className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm border border-[#D0D5DD] bg-white/70 text-[#344054] hover:bg-white transition">
					{t("next")}
				</button>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-[#8A97AB] text-sm">Page 1 of 100</span>
			</div>
		</div>
	);
}

export default NewSubscribers;