'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Flame, Heart, Smile, PenLine, Sun, ShieldCheck } from 'lucide-react';
import { useApp } from './providers';
import { Botanical } from './brand';
import { MoodPicker } from './mood-picker';
import { TrendChart } from './charts';
import { MoodCalendar } from './calendar';
import { QuoteCard } from './quotes';
import { dailyQuote, findMood } from '@/lib/catalog';
import { localDate, getStreak } from '@/lib/utils';
import { EntryCard } from './diary';
export function Dashboard() {
    const { data } = useApp();
    if (!data)
        return null;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const today = data.moods.find(m => m.date === localDate());
    const mood = findMood(today?.mood);
    const streak = getStreak(data.moods.map(m => m.date));
    return <div id="main-content" className="page-enter">
  <div className="page-heading">
    <div>
      <div className="eyebrow greeting-date">
        <Sun size={14}/>
        {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <h1>{greeting}, {data.user.name.split(' ')[0]} <span className="heading-flower">✿</span></h1>
      <p>Welcome to your little corner of calm. Let’s make space for you.</p>
    </div>
    <Link href="/diary/new" className="button button-primary"><PenLine size={16}/> Write in my diary</Link>
  </div>
  <section className="welcome-banner">
    <div>
      <span className="eyebrow">YOUR FEELINGS DESERVE A PLACE</span>
      <h2>You don’t have to have it all<br />figured out to <em>grow.</em></h2>
      <p>A moment to reflect. A little room to breathe.<br />This is your space to simply be.</p>
      <Link className="banner-link" href="/mood-tracker">Let’s check in <ArrowRight size={17}/></Link>
    </div>
    <div className="banner-art">
      <span className="art-orbit orbit-one"/>
      <span className="art-orbit orbit-two"/>
      <Botanical />
      <span className="art-caption">grow at your own pace</span>
    </div>
  </section>
  <div className="stats-grid">
    <Link href="/mood-tracker" className="stat-card">
      <span className="stat-icon peach">{mood ? <span>{mood.emoji}</span> : <Smile size={20}/>}</span>
      <div>
        <span>Today’s mood</span>
        <b>{mood?.label || 'A fresh start'}</b>
        <small>{mood ? 'Thanks for checking in' : 'How’s your heart today?'}</small>
      </div>
      <ArrowUpRight size={16}/>
    </Link>
    <Link href="/diary" className="stat-card">
      <span className="stat-icon lavender"><BookOpen size={20}/></span>
      <div>
        <span>Pages of your story</span>
        <b>
          {data.entries.length}
          <em>diary entries</em>
        </b>
        <small>Every word is a little release</small>
      </div>
      <ArrowUpRight size={16}/>
    </Link>
    <Link href="/insights" className="stat-card">
      <span className="stat-icon rose"><Flame size={20}/></span>
      <div>
        <span>Showing up for yourself</span>
        <b>
          {streak}
          <em>day {streak === 1 ? 'streak' : 'streak'}</em>
        </b>
        <small>{streak ? 'Keep your little ritual going' : 'Your next chapter starts today'}</small>
      </div>
      <ArrowUpRight size={16}/>
    </Link>
  </div>
  <section className="card dashboard-moods"><MoodPicker /></section>
  <div className="dashboard-columns">
    <div className="dashboard-main-column">
      <section className="card"><TrendChart /></section>
      <section className="recent-section">
        <div className="section-heading">
          <div>
            <h2>Little moments, kept close</h2>
            <p>A few pages from your story.</p>
          </div>
          <Link className="text-button" href="/diary">View my diary <ArrowRight size={14}/></Link>
        </div>
        {data.entries.length ? <div className="recent-entries">{data.entries.slice(0, 2).map(e => <EntryCard key={e.id} entry={e} compact/>)}</div> : <div className="card empty-diary">
          <span className="empty-icon"><BookOpen size={25}/></span>
          <div>
            <h3>Your story starts with a single page.</h3>
            <p>A thought, a feeling, a tiny moment worth keeping.</p>
            <Link className="text-button" href="/diary/new">Write my first entry <ArrowRight size={14}/></Link>
          </div>
        </div>}
      </section>
    </div>
    <div className="dashboard-side-column">
      <QuoteCard quote={dailyQuote()} featured/>
      <MoodCalendar compact/>
    </div>
  </div>
  <div className="reassurance">
    <ShieldCheck size={15}/>
    <span>Your thoughts are personal. Your space is private.</span>
    <span>A little more you, every day. <Heart size={12}/></span>
  </div>
    </div>;
}
