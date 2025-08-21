"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    document.cookie = `locale=${newLocale}; path=/`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 p-2">
      {t("label")}:
      <select
        value={locale}
        onChange={handleChange}
        className="border rounded p-1 bg-background text-foreground"
      >
        <option value="en">{t("en")}</option>
        <option value="hi">{t("hi")}</option>
      </select>
    </label>
  );
}
