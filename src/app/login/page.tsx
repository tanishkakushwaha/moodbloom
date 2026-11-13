import { AuthPage } from "@/components/account";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export const metadata = { title: "Welcome back" };
export default async function Page() {
    const session = await auth();
    if (session?.user?.id)
        redirect("/dashboard");
    return <AuthPage signup={false} google={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)}/>;
}
