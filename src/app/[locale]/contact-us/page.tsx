"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

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
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Textarea from "@/components/ui/textarea";



export default function ContactUs() {
    const [state, setState] = React.useState({ email: "", message: "", subject: "", name: "" });
    const t = useTranslations("contact");

    return (
        <section className='relative pt-24 md:pt-32 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
            style={{
            }}>
            <Image src="/photos/terms-bg.webp" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />
            <div className="px-4 mx-auto max-w-2xl relative z-2">
                <h2
                    className="mb-2 text-2xl lg:text-6xl font-medium leading-[120%] text-center bg-clip-text text-transparent"
                    style={{
                        backgroundImage: "linear-gradient(182.28deg, #301B69 36.46%, #B07CD1 97.83%)"
                    }}
                >
                    {t("title")}
                </h2>
                <p className="text-base font-medium text-[#301B69] text-center mb-2">
                    {t("subtitle")}
                </p>

                <div className="flex items-center justify-center flex-col md:flex-row gap-4 md:gap-8 mb-4">
                    <div className="flex items-center gap-2">
                        <a href="https://wa.me/1234567890" className="text-[#301B69] underline text-lg">+1 (555) 000-0000</a>
                        <Image src="/icons/whatsapp.webp" alt="" width={24} height={24} />
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="mailto:email@example.com" className="text-[#301B69] underline text-lg">email@example.com</a>
                        <Image src="/icons/mail.webp" alt="" width={24} height={24} />
                    </div>
                </div>

                <Card className="rounded-[32px] py-10 px-4 md:px-12 border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)] ">
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                            >
                                <TextField
                                    placeholder={t("subject")}
                                    endAdornment={null}
                                    value={state.subject}
                                    className="text-[1rem]"
                                    aria-label={t("subject")}
                                    onChange={(e) =>
                                        setState((s) => ({ ...s, subject: e.target.value }))
                                    }
                                />
                            </FormField>
                            <FormField
                            >
                                <TextField
                                    placeholder={t("name")}
                                    endAdornment={null}
                                    value={state.name}
                                    className="text-[1rem]"
                                    aria-label={t("name")}
                                    onChange={(e) =>
                                        setState((s) => ({ ...s, name: e.target.value }))
                                    }
                                />
                            </FormField>
                        </div>
                        <FormField
                            error={state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) ? t("emailInvalid") : undefined}
                        >
                            <TextField
                                placeholder={t("email")}
                                endAdornment={null}
                                value={state.email}
                                onChange={(e) =>
                                    setState((s) => ({ ...s, email: e.target.value }))
                                }
                                className="text-[1rem]"
                                aria-label={t("email")}
                            />
                        </FormField>

                        <FormField
                        >
                            <Textarea
                                placeholder={t("message")}
                                value={state.message}
                                onChange={(e) =>
                                    setState((s) => ({ ...s, message: e.target.value }))
                                }
                                className="text-[1rem]"
                                aria-label={t("message")}
                            />
                        </FormField>

                        <div className="pt-2">
                            <Button className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-3 text-lg font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)]">
                                {t("send")}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter />
                </Card>
            </div>
        </section>
    );
}
