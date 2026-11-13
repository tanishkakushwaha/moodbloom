import { Suspense } from "react";
import { DiaryEditor } from "@/components/diary";
export const metadata = { title: "Revisit a moment" };
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;
    return <Suspense><DiaryEditor id={id}/></Suspense>;
}
