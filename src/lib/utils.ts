import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function readableDate(date: string, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat('en', options ?? { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}
export function getStreak(dates: string[], today = localDate()) {
    const days = new Set(dates);
    const cursor = new Date(`${today}T12:00:00`);
    if (!days.has(localDate(cursor)))
        cursor.setDate(cursor.getDate() - 1);
    let count = 0;
    while (days.has(localDate(cursor))) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return count;
}
