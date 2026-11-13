import { AuthPage } from "@/components/account";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export const metadata = { title: "Start your journey" };
export default async function Page() {
    const session = await auth();
    if (session?.user?.id)
        redirect("/dashboard");
    return <AuthPage signup={true} google={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)}/>;
}
