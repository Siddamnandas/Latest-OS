"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
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
        // Base layout and spacing
        "inline-flex items-center justify-center gap-1 p-1.5 w-fit",
        // Background with glass effect
        "bg-muted/50 backdrop-blur-sm border border-border/50",
        "rounded-xl shadow-sm",
        // Dark mode support
        "dark:bg-muted/30 dark:border-border/30",
        // Subtle inner shadow for depth
        "shadow-inner shadow-black/5 dark:shadow-black/20",
        "text-muted-foreground",
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
        // Base styles
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap",
        // Transitions and animations
        "transition-all duration-300 ease-in-out transform-gpu",
        // Default state
        "text-muted-foreground hover:text-foreground",
        "hover:bg-muted/50 hover:scale-[1.02] hover:shadow-md",
        // Active state with gradient and glow
        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary",
        "data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg",
        "data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.05]",
        "data-[state=active]:border-primary/20",
        // Dark mode support
        "dark:text-muted-foreground dark:hover:text-foreground",
        "dark:hover:bg-muted/30",
        "dark:data-[state=active]:from-primary/80 dark:data-[state=active]:to-primary/90",
        "dark:data-[state=active]:shadow-primary/20",
        // Focus states
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        // Icon styles
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg]:transition-all [&_svg]:duration-300",
        "data-[state=active]:[&_svg]:scale-110 data-[state=active]:[&_svg]:drop-shadow-sm",
        // Pseudo-element for subtle highlight
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r",
        "before:from-transparent before:via-white/10 before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100 data-[state=active]:before:opacity-30",
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
