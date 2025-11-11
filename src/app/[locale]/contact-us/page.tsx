"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import Image from "next/image";
import Textarea from "@/components/ui/textarea";
import api from "@/lib/axiosClient";

export default function ContactUs() {
    const [state, setState] = React.useState({ email: "", message: "", name: "" });
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const t = useTranslations("contact");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!state.name.trim()) {
            setError(t("nameRequired") || "Name is required");
            return;
        }
        if (!state.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
            setError(t("emailInvalid") || "Invalid email");
            return;
        }
        if (!state.message.trim()) {
            setError(t("messageRequired") || "Message is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post("/contact-us", {
                email: state.email,
                name: state.name,
                message: state.message,
            }, {
                headers: { skipAuth: true } // if endpoint doesn't require auth
            });

            setSuccess(true);
            setState({ email: "", message: "", name: "" });
            
            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                t("sendError") || "Failed to send message"
            );
        } finally {
            setLoading(false);
        }
    };

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
                        <a href="https://wa.me/0508229060" className="text-[#301B69] underline text-lg">0508229060</a>
                        <Image src="/icons/whatsapp.webp" alt="" width={24} height={24} />
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="mailto:info@zwajin.com" className="text-[#301B69] underline text-lg">info@zwajin.com</a>
                        <Image src="/icons/mail.webp" alt="" width={24} height={24} />
                    </div>
                </div>

                <Card className="rounded-[32px] py-10 px-4 md:px-12 border-[#EEE9FA]/90 shadow-[0_20px_60px_rgba(80,40,160,0.15)]">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-3">
                            {success && (
                                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-200">
                                    {t("sendSuccess") || "Message sent successfully!"}
                                </div>
                            )}

                            {error && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                                    {error}
                                </div>
                            )}

                            <FormField>
                                <TextField
                                    placeholder={t("name")}
                                    endAdornment={null}
                                    value={state.name}
                                    className="text-[1rem]"
                                    aria-label={t("name")}
                                    onChange={(e) =>
                                        setState((s) => ({ ...s, name: e.target.value }))
                                    }
                                    required
                                />
                            </FormField>

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
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Textarea
                                    placeholder={t("message")}
                                    value={state.message}
                                    onChange={(e) =>
                                        setState((s) => ({ ...s, message: e.target.value }))
                                    }
                                    className="text-[1rem]"
                                    aria-label={t("message")}
                                    required
                                />
                            </FormField>

                            <div className="pt-2">
                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-[20px] border-[3px] border-[#E5DDF7] bg-[linear-gradient(180deg,#6B3FA0_0%,#2D0B5A_100%)] py-3 text-lg font-semibold shadow-[0_12px_24px_0_rgba(80,40,160,0.25),inset_0_2px_8px_0_rgba(255,255,255,0.20)] disabled:opacity-50"
                                >
                                    {loading ? (t("sending") || "Sending...") : t("send")}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                    <CardFooter />
                </Card>
            </div>
        </section>
    );
}
