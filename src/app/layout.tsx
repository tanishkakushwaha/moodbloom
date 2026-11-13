import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/branding';
import { ThemeProvider } from '@/components/providers';
import './globals.css';
export const metadata: Metadata = { icons: { icon: '/icon.svg' }, title: { default: `${APP_NAME} — A little space for your feelings`, template: `%s · ${APP_NAME}` }, description: 'A peaceful, private home for your daily moods, personal stories, and little moments of growth.' };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return <html lang="en" suppressHydrationWarning><body>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <ThemeProvider>{children}</ThemeProvider>
  </body></html>;
}
