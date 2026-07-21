import type { UIStrings } from "./types";
import en from "./lang/en";
import zh from "./lang/zh";

const translations = { en, zh } satisfies Record<string, UIStrings>;

/** Returns UI strings for the given locale, falling back to English. */
export function useTranslations(locale: string = "en"): UIStrings {
  return translations[locale as keyof typeof translations] ?? translations.en;
}
