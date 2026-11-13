import { MoodCalendar } from "@/components/calendar";
export const metadata = { title: "Mood calendar" };
export default function Page() {
    return <div id="main-content" className="page-enter">
  <div className="page-heading"><div>
      <span className="eyebrow">YOUR DAYS, IN EVERY SHADE</span>
      <h1>A month of being you <span className="heading-flower">✿</span></h1>
      <p>Little moments, colorful feelings, and all the days in between.</p>
    </div></div>
  <MoodCalendar />
    </div>;
}
