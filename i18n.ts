import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale for development
  const locale = 'en';

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});