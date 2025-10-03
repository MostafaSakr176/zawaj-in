"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const Locale = useLocale()
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      dir={Locale === "ar" ? "rtl" : "ltr"}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#6B3FA0] data-[state=active]:to-[#2D0B5A] data-[state=active]:text-white bg-white text-[#301B69] px-6 py-2 h-12 rounded-[50px] text-base font-normal transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 shadow-[0_4px_24px_0_rgba(80,40,160,0.10),inset_0_2px_8px_0_rgba(255,255,255,0.20)] border-[3px] border-[#E5DDF7]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
