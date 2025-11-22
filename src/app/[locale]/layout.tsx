import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "../../components/shared/navbar";
import Footer from "@/components/shared/footer";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from 'react-hot-toast';
import { headers } from "next/headers";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "ZwajIn",
  description: "ZwajIn is a modern matchmaking platform for serious relationships.",
  keywords: [
    "marriage",
    "matchmaking",
    "zawaj",
    "zwaj",
    "halal dating",
    "serious relationships",
    "Muslim marriage",
    "زواج",
    "تعارف",
    "خطبة"
  ],
  icons: {
    icon: "/favicon.ico"
  },
  other: {
    "apple-mobile-web-app-capable": "yes"
  }
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Check if the current route is a dashboard route
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isDashboard = pathname.includes("/dashboard");

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="!mr-0 !ml-0 !overflow-auto">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SocketProvider>
              {!isDashboard && <Navbar />}
              {children}
              <Toaster />
              {!isDashboard && <Footer />}
            </SocketProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
