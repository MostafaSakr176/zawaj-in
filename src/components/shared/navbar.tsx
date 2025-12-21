"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookUser, ChevronDown, Contact, FileText, Headset, Heart, House, Menu, MessageCircle, NotebookText, Package, Podcast, Power, RefreshCcw, Siren, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useConversations } from '@/hooks/useChat';

const Navbar = () => {
  const t = useTranslations("navbar");
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [navKey, setNavKey] = useState(0);
  const [hash, setHash] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>(""); // New state for scroll-based active section

  // --- Realtime unseen messages state ---
  const { conversations, refreshConversations } = useConversations();
  const [liveUnread, setLiveUnread] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to calculate unread
  const calcUnread = (convs: typeof conversations) => {
    return convs.reduce((total, conv) => {
      return total + (conv.unreadCount || 0);
    }, 0);
  };

  // Keep unread state in sync (immediate and with polling)
  useEffect(() => {
    if (isAuthenticated) {
      setLiveUnread(calcUnread(conversations));
    } else {
      setLiveUnread(0);
    }
  }, [isAuthenticated, conversations]);

  // Setup real-time polling
  useEffect(() => {
    // If hook provides a real-time subscription, use that here.
    if (!isAuthenticated) return;
    // Poll every 5 seconds as a fallback. Adjust if your backend supports websockets.
    pollingRef.current = setInterval(() => {
      if (typeof refreshConversations === "function") {
        refreshConversations();
      }
    }, 5000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [isAuthenticated, refreshConversations]);

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1];

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  // Scroll spy function to detect which section is in view
  const handleScroll = useCallback(() => {
    const sections = ['advantages', 'subscriptions', 'userOpinion']; // Add your section IDs here
    const scrollPosition = window.scrollY + 200; // Offset for better detection

    // Check if we're at the top of the page (main page)
    if (window.scrollY < 100) {
      setActiveSection("");
      return;
    }

    // Find which section is currently in view
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveSection(`#${sectionId}`);
          return;
        }
      }
    }

    // If no section is found, keep the current active section
  }, []);

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    // Set initial hash
    updateHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateHash);

    // Listen for popstate (back/forward browser buttons)
    window.addEventListener("popstate", updateHash);

    // Add scroll listener for scroll spy
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial scroll position check
    handleScroll();

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, handleScroll]);

  // Handle hash link clicks
  const handleHashClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.substring(1); // Remove the leading "/"
      const sectionId = hash.substring(1); // Remove the "#" to get the ID

      // Check if we're already on the home page
      const isOnHomePage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

      if (isOnHomePage) {
        // We're already on home page, just update hash and scroll
        window.history.pushState(null, "", `${pathname}${hash}`);
        setHash(hash);
        setActiveSection(hash); // Update active section immediately

        // Scroll to element if it exists
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // We're on a different page, navigate to home page with hash
        router.push(`/${currentLocale}${hash}`);
      }
    }
    setNavKey(navKey + 1);
  };

  // Handle main page click - removes hash
  const handleMainPageClick = (href: string) => {
    if (href === "/") {
      const isOnHomePage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

      if (isOnHomePage && (hash || activeSection)) {
        // We're on home page with a hash or active section, remove both
        window.history.pushState(null, "", `/${currentLocale}`);
        setHash("");
        setActiveSection(""); // Clear active section
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!isOnHomePage) {
        // We're on a different page, navigate to home page
        router.push(`/${currentLocale}`);
      }
    }
    setNavKey(navKey + 1);
  };

  // Navigation links for guests and authenticated users
  const guestLinks = [
    { href: "/", label: t('mainPage'), icon: <House strokeWidth={1.75} size={24} />, bold: true },
    { href: "/#advantages", label: t('advantages'), icon: <BookUser strokeWidth={1.25} size={24} /> },
    { href: "/#subscriptions", label: t('subscriptions'), icon: <Podcast strokeWidth={1.25} size={24} /> },
    { href: "/#userOpinion", label: t('userOpinion'), icon: <NotebookText strokeWidth={1.25} size={24} /> },
    { href: "/contact-us", label: t('contactUs'), icon: <Contact strokeWidth={1.25} size={24} /> },
    { href: "/terms-of-use", label: t('usagePolicy'), icon: <Siren strokeWidth={1.25} size={24} /> },
  ];

  const authLinks = [
    { href: "/home", label: t('mainPage'), icon: <House strokeWidth={1.25} size={24} />, activeIcon: <House strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/chats", label: t('chats'), icon: <MessageCircle strokeWidth={1.25} size={24} />, activeIcon: <MessageCircle strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/favorites", label: t('favorits'), icon: <Heart strokeWidth={1.25} size={24} />, activeIcon: <Heart strokeWidth={2} size={24} color='#301B69' /> },
    { href: "/profile", label: t('profile'), icon: <User strokeWidth={1.25} size={24} />, activeIcon: <User strokeWidth={2} size={24} color='#301B69' /> },
  ];

  const mobileAuthLinks = [
    { href: "/home", icon: <House strokeWidth={1.25} size={32} />, activeIcon: <House strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/chats", icon: <MessageCircle strokeWidth={1.25} size={32} />, activeIcon: <MessageCircle strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/favorites", icon: <Heart strokeWidth={1.25} size={32} />, activeIcon: <Heart strokeWidth={2} size={32} color='#301B69' /> },
    { href: "/profile", icon: <User strokeWidth={1.25} size={32} />, activeIcon: <User strokeWidth={2} size={32} color='#301B69' /> },
  ];

  // Updated function to check if link is active
  const isLinkActive = (href: string) => {
    if (href === "/") {
      // Main page is active if we're on the home page with no hash or active section
      return pathname.endsWith(currentLocale) && (!hash || hash === "") && (!activeSection || activeSection === "");
    } else if (href.startsWith("/#")) {
      const linkHash = href.substring(1); // Remove the leading "/"
      const isOnHomePage = pathname.endsWith(currentLocale);

      // Link is active if:
      // 1. We're on home page AND hash matches the link hash, OR
      // 2. We're on home page AND activeSection matches the link hash (from scroll spy)
      return isOnHomePage && (hash === linkHash || activeSection === linkHash);
    } else {
      // For non-hash links, use the original logic
      return pathname.includes(href);
    }
  };

  return (
    <>
      <div className="w-full fixed top-4 md:top-8 z-50 px-4">
        <div className="flex items-center justify-between max-w-7xl rounded-2xl md:rounded-[24px] mx-auto px-5 py-3 bg-white/80 backdrop-blur-lg shadow-lg">
          {/* Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex-shrink-0">
            <div className='rtl:block ltr:hidden' >
              {/* ...svg code unchanged... */}
              <svg width="114" height="41" className='w-20 h-8 md:w-28 md:h-10' viewBox="0 0 114 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ...svg unchanged for brevity... */}
              </svg>
            </div>
            <div className="rtl:hidden ltr:block" >
              {/* ...svg code unchanged... */}
              <svg width="100" height="36" viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ...svg unchanged for brevity... */}
              </svg>
            </div>
          </Link>

          {/* Navigation Links - Center */}
          <nav className="hidden lg:block">
            <div className="flex items-center justify-around gap-6">
              {(isAuthenticated ? authLinks : guestLinks).map(link => {
                const isActive = isLinkActive(link.href);
                const isChatLink = link.href === "/chats" && isAuthenticated;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === "/") {
                        e.preventDefault();
                        handleMainPageClick(link.href);
                      } else if (link.href.startsWith("/#")) {
                        e.preventDefault();
                        handleHashClick(link.href);
                      }
                      setNavKey(navKey + 1);
                    }}
                    className={`flex items-center gap-1 text-[#301B69] hover:text-[#301B69] p-1 text-lg transition-colors relative
                    ${isActive ? "border-b-2 border-[#301B69] font-bold" : "font-medium"}
                  `}
                  >
                    {link.label}
                    {isChatLink && liveUnread > 0 && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[#DF1C41] text-white text-[10px] font-bold rounded-full">
                        {liveUnread > 99 ? '99+' : liveUnread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right side - Language toggle and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button onClick={toggleLanguage} variant={"ghost"} className='font-sans hover:decoration-0 text-2xl flex items-center gap-2 font-bold p-1'>
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 1L19 5M19 5L15 9M19 5H5C3.93913 5 2.92172 5.42143 2.17157 6.17157C1.42143 6.92172 1 7.93913 1 9V11M5 23L1 19M1 19L5 15M1 19H15C16.0609 19 17.0783 18.5786 17.8284 17.8284C18.5786 17.0783 19 16.0609 19 15V13" stroke="#090909" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('languageToggle')}
            </Button>
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu dir={currentLocale === "ar" ? 'rtl' : 'ltr'}>
                <DropdownMenuTrigger className='flex items-center gap-4 px-4 py-3 rounded-[16px] text-lg font-normal transition-all disabled:opacity-50 shrink-0 bg-gradient-to-b from-[#6B3FA0] to-[#2D0B5A] text-white shadow-[0_4px_24px_0_rgba(80,40,160,0.10),inset_0_2px_8px_0_rgba(255,255,255,0.20)] border-[3px] border-[#E5DDF7]'>
                  {t("accountMenu.myAccount")}<ChevronDown size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' className='transform rtl:translate-x-[1.6rem] ltr:-translate-x-[1.2rem]'>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Link href="/contact-us" className='flex items-center gap-3 w-full'>
                      <Headset size={22} color='#301B69' />
                      {t("accountMenu.contactUs")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-[#301B69] font-medium text-lg'>
                    <Link href="/profile" className='flex items-center gap-3 w-full'>
                      <User size={22} color='#301B69' />
                      {t("accountMenu.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-[#FF3B30] hover:text-[#FF3B30] font-medium text-lg'
                    onClick={logout}
                  >
                    <Power size={22} color='#FF3B30' />
                    {t("accountMenu.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/sign-in">
                <Button>
                  {t('loginButton')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger className="text-gray-700 hover:text-[#301B69] lg:hidden">
              <Menu strokeWidth={1.25} size={30} />
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col items-start justify-around gap-6">
                {(isAuthenticated ? authLinks : guestLinks).map(link => {
                  const isActive = isLinkActive(link.href);
                  const isChatLink = link.href === "/chats" && isAuthenticated;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href === "/") {
                          e.preventDefault();
                          handleMainPageClick(link.href);
                        } else if (link.href.startsWith("/#")) {
                          e.preventDefault();
                          handleHashClick(link.href);
                        }
                        setNavKey(navKey + 1);
                      }}
                      className={`flex items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg transition-colors
                      ${isActive ? "font-bold" : "font-medium"}
                    `}
                    >
                      {link.icon}
                      {link.label}
                      {isChatLink && liveUnread > 0 && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[#DF1C41] text-white text-[10px] font-bold rounded-full">
                          {liveUnread > 99 ? '99+' : liveUnread}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <Button onClick={toggleLanguage} variant={"ghost"} className='flex md:hidden items-center gap-3 text-[#301B69] hover:text-[#301B69] p-1 text-lg font-medium transition-colors'>
                  <RefreshCcw size={24} />
                  {t('languageToggle')}
                </Button>
                {!isAuthenticated ? (
                  <Link href="/auth/sign-in" className='w-full'>
                    <Button className='w-full block md:hidden rounded-[50px]'
                      style={{
                        background: "linear-gradient(182.28deg, #271850 36.46%, #301B69 97.83%)",
                      }}>
                      {t('loginButton')}
                    </Button>
                  </Link>
                ) : (
                  <Button className='w-full block md:hidden rounded-[50px] bg-red-600 hover:bg-red-700'
                    onClick={logout}
                  >
                    {t("accountMenu.logout")}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isAuthenticated && !pathname.includes("chats") && (
        <div className="w-full fixed bottom-6 z-50 px-4 block md:hidden">
          <div className="flex items-center justify-center gap-6 rounded-4xl mx-auto px-6 py-3 bg-white shadow-lg">
            {mobileAuthLinks.map(link => {
              const isActive = isLinkActive(link.href);
              const isChatLink = link.href === "/chats";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setNavKey(navKey + 1)}
                  className={`text-[#BFC6CC] p-1 text-lg transition-colors relative`}
                >
                  {isActive ? link.activeIcon : link.icon}
                  {isChatLink && liveUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[#DF1C41] text-white text-[10px] font-bold rounded-full">
                      {liveUnread > 99 ? '99+' : liveUnread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
