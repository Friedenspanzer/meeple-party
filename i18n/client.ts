"use client";

import { useUserPreferences } from "@/hooks/useUserPreferences";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { useEffect, useState } from "react";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import { fallbackLng, getOptions, languages } from "./settings";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined,
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation(ns?: string, options?: any) {
  const ret = useTranslationOrg(ns, options);
  const { preferences } = useUserPreferences();
  const language = preferences?.pageLanguage || fallbackLng;
  const { i18n } = ret;
  const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage);
  useEffect(() => {
    if (activeLanguage === i18n.resolvedLanguage) return;
    setActiveLanguage(i18n.resolvedLanguage);
  }, [activeLanguage, i18n.resolvedLanguage]);
  useEffect(() => {
    if (!language || i18n.resolvedLanguage === language) return;
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return ret;
}
