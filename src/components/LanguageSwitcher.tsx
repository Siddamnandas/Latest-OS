'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();

  const locales = [
    { code: 'en', name: t('en'), flag: '🇺🇸' },
    { code: 'hi', name: t('hi'), flag: '🇮🇳' }
  ];

  const handleLanguageChange = (nextLocale: string) => {
    // Set the locale cookie
    document.cookie = `locale=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // Reload the page to apply the new locale
    window.location.reload();
  };

  const currentLanguage = locales.find(l => l.code === locale) || locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={t('label')}
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleLanguageChange(l.code)}
            className="gap-2"
          >
            <span>{l.flag}</span>
            <span>{l.name}</span>
            {locale === l.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}