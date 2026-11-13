import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AppProvider } from '@/components/providers';
import { AppShell } from '@/components/app-shell';
export default async function ProtectedLayout({ children }: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.id)
        redirect('/login');
    return <AppProvider><AppShell>{children}</AppShell></AppProvider>;
}
