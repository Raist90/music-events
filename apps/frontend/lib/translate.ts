import it from "./translations/it.json";

const locales = { it };

export type Locale = keyof typeof locales;

export function translate<T extends keyof typeof locales>(locale: T) {
  const translations = locales[locale];

  if (!translations) {
    throw new Error(`Translations for locale "${locale}" not found.`);
  }

  type TranslationKey<T extends object> = {
    [K in keyof T]: K extends string
      ? T[K] extends string
        ? K
        : T[K] extends object
          ? `${K}.${TranslationKey<T[K]>}`
          : never
      : never;
  }[keyof T];

  const t = (
    key: TranslationKey<(typeof locales)[T]>,
    replacements?: Record<string, string>,
  ) => {
    const keys = key.split(".");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current = translations as Record<string, any> | string;
    for (const k of keys) {
      if (typeof current !== "object" || current === null || !(k in current)) {
        console.warn(`Translation key "${key}" not found.`);
        return "";
      }
      current = current[k];
    }

    if (typeof current !== "string") {
      console.warn(`Translation key "${key}" does not point to a string.`);
      return "";
    }

    if (!replacements) return current;

    const matches = current.match(/{[a-zA-Z_]+}/g) || [];
    for (const match of matches) {
      const placeholder = match.slice(1, -1); // Remove { and }
      if (placeholder in replacements) {
        current = current.replace(match, replacements[placeholder]);
      } else {
        console.warn(
          `Variable "${placeholder}" not found in translation key "${key}".`,
        );
      }
    }

    return current;
  };

  return {
    t,
  };
}
