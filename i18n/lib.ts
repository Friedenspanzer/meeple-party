import { fallbackLng } from "./settings";

//TODO Test, document
export function determineLanguage({
  pageLanguage,
  fallbackLanguage,
}: {
  pageLanguage: string;
  fallbackLanguage: string;
}) {
  if (pageLanguage === "auto") {
    return fallbackLanguage;
  } else {
    return pageLanguage;
  }
}

//TODO Test, document
export function determineGameLanguage({
  gameLanguage,
  pageLanguage,
  fallbackLanguage,
}: {
  gameLanguage: string;
  pageLanguage: string;
  fallbackLanguage: string;
}) {
  if (gameLanguage === "auto") {
    return fallbackLng;
  } else if (gameLanguage === "follow") {
    return determineLanguage({ pageLanguage, fallbackLanguage });
  } else {
    return gameLanguage;
  }
}
