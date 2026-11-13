import { Suspense } from "react";
import { DiaryEditor } from "@/components/diary";
export const metadata = { title: "A fresh page" };
export default function Page() {
    return <Suspense><DiaryEditor /></Suspense>;
}
