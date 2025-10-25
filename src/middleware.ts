import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware({
  ...routing,
  defaultLocale: 'ar', // إجبار اللغة الافتراضية عربي
  localeDetection: false, // 🔥 يمنع اكتشاف اللغة من المتصفح (Edge/Chrome)
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*'],
};
