"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./language-context";
import { SUPPORTED_LOCALES, SupportedLocale } from "@/lib/i18n";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LOCALES.find(l => l.code === locale) || SUPPORTED_LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-9 items-center space-x-1.5 rounded-md border border-border/60 bg-card/50 px-2 py-1 text-xs font-semibold transition-colors hover:bg-muted sm:px-2.5"
        aria-label="Select language"
      >
        <Globe size={14} className="text-primary" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown size={12} className="text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg border bg-popover text-popover-foreground shadow-xl z-50 py-1 text-xs">
          {SUPPORTED_LOCALES.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLocale(item.code as SupportedLocale);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/80 transition-colors ${
                locale === item.code ? "bg-primary/15 text-primary font-bold" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{item.flag}</span>
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">{item.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
