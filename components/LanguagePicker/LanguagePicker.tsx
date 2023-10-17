"use client";

import { useUser } from "@/context/userContext";
import { UserPreferences } from "@/datatypes/userProfile";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import { language } from "gray-matter";
import styles from "languagepicker.module.css";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

type LanguagePickerType = "page" | "game";

interface LanguagePickerProps {
  availableLanguages: string[];
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

  const update = useCallback(
    (language: string) => {
      const mutator = getCurrentMutator(type);
      updatePreferences(mutator(language)).then(() => router.refresh());
    },
    [router, type, updatePreferences]
  );

  return (
    <>
      {availableLanguages.map((language) => (
        <button
          type="button"
          className={classNames("btn me-3 mb-2", {
            ["btn-light"]: language !== current,
            ["btn-primary"]: language === current,
          })}
          key={language}
          onClick={() => update(language)}
        >
          {t(`Languages.${language}`)}
        </button>
      ))}
    </>
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
): (language: string) => Partial<UserPreferences> {
  if (type === "game") {
    return (language) => ({ gameLanguage: language });
  } else {
    return (language) => ({ pageLanguage: language });
  }
}

export default LanguagePicker;
