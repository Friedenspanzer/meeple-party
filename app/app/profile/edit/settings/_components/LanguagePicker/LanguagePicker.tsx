"use client";

import { useTranslation } from "@/i18n/client";
import { GameLanguage, Language, PageLanguage } from "@/i18n/types";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import { UserPreferences } from "@/lib/types/userProfile";
import { Alert, Button, Group, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

type LanguagePickerType = "page" | "game";

interface LanguagePickerProps {
  availableLanguages: Language[];
  type: LanguagePickerType;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({
  availableLanguages,
  type,
}) => {
  const { t } = useTranslation("languagepicker");
  const router = useRouter();
  const {
    preferences,
    loading,
    update: updatePreferences,
  } = useUserPreferences();

  const current = useMemo(() => {
    if (loading) {
      return "";
    } else {
      return getCurrentSelector(type)(preferences);
    }
  }, [loading, type, preferences]);

  const mutator = useCallback(getCurrentMutator(type), [type]);

  const update = useCallback(
    (language: Language) => {
      updatePreferences(mutator(language as any)).then(() => router.refresh());
    },
    [router, updatePreferences]
  );

  const icon = useMemo(() => <i className="bi bi-emoji-frown-fill"></i>, []);

  return (
    <Stack>
      <Group>
        {availableLanguages.map((language) => (
          <Button
            variant={language === current ? "filled" : "default"}
            key={language}
            onClick={() => update(language)}
          >
            {t(`Languages.${language}`)}
          </Button>
        ))}
      </Group>
      {current === "auto" && (
        <Alert
          title={t("NotWorkingWarning.NotWorking")}
          variant="light"
          color="red"
          icon={icon}
        >
          {t("NotWorkingWarning.Text")}
        </Alert>
      )}
    </Stack>
  );
};

function getCurrentSelector(type: LanguagePickerType) {
  if (type === "game") {
    return (preferences: UserPreferences) => preferences.gameLanguage;
  } else {
    return (preferences: UserPreferences) => preferences.pageLanguage;
  }
}

function getCurrentMutator(
  type: LanguagePickerType
):
  | ((language: GameLanguage) => Partial<UserPreferences>)
  | ((language: PageLanguage) => Partial<UserPreferences>) {
  if (type === "game") {
    return (language: GameLanguage) => ({ gameLanguage: language });
  } else {
    return (language: PageLanguage) => ({ pageLanguage: language });
  }
}

export default LanguagePicker;
