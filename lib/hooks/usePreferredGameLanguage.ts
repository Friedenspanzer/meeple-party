import { determineGameLanguage } from "@/i18n/lib";
import { fallbackLng } from "@/i18n/settings";
import { GameLanguage } from "@/i18n/types";
import { useUserPreferences } from "./useUserPreferences";

interface UsePreferredGameLanguageResult {
  /** Wether results are still loading. */
  loading: boolean;
  /** Language the user wants to see game names in. */
  preferredGameLanguage: GameLanguage;
}

/**
 * Use the language the user preferes to see game names in. Defaults to the fallback language during load.
 */
export default function usePreferredGameLanguage(): UsePreferredGameLanguageResult {
  const { loading, preferences } = useUserPreferences();

  if (loading) {
    return {
      loading,
      preferredGameLanguage: fallbackLng,
    };
  } else {
    const preferredGameLanguage = determineGameLanguage(
      preferences.gameLanguage,
      preferences.pageLanguage,
      fallbackLng
    );
    return {
      loading,
      preferredGameLanguage,
    };
  }
}
