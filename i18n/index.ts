import { getServerUser } from "@/utility/serverSession";
import { getUserPreferences } from "@/utility/userProfile";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { fallbackLng, getOptions } from "./settings";

const initI18next = async (ns?: string) => {
  const lng = await getLanguage();
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function getTranslation(ns?: string, options: any = {}) {
  const lng = await getLanguage();
  const i18nextInstance = await initI18next(ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

//TODO Add tests for language fetching methods
export async function getLanguage() {
  try {
    const user = await getServerUser();
    const preferences = getUserPreferences(user);
    if (preferences.pageLanguage === "auto") {
      return fallbackLng;
    } else {
      return preferences.pageLanguage;
    }
  } catch {
    return fallbackLng;
  }
}

export async function getGameLanguage() {
  try {
    const user = await getServerUser();
    const preferences = getUserPreferences(user);
    if (preferences.gameLanguage === "auto") {
      return fallbackLng;
    } else if (preferences.gameLanguage === "follow") {
      return getLanguage();
    } else {
      return preferences.gameLanguage;
    }
  } catch {
    return fallbackLng;
  }
}
