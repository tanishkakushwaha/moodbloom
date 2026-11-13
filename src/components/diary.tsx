'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, PenLine, Search, ArrowRight, ArrowLeft, LockKeyhole, Tag, CalendarDays, Trash2, LoaderCircle, Check, Feather, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApp, request, notifyError, type Entry } from './providers';
import { moods, findMood } from '@/lib/catalog';
import { localDate, readableDate } from '@/lib/utils';
import { diarySchema, dateSchema } from '@/lib/validation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
export function EntryCard({ entry, compact = false }: {
    entry: Entry;
    compact?: boolean;
}) {
    const mood = findMood(entry.mood);
    return <Link href={`/diary/${entry.id}`} className={`card entry-card ${compact ? 'entry-compact' : ''}`}>
  <div className="entry-top">
    <span className="entry-date">{readableDate(entry.date, { month: 'short', day: 'numeric' })}</span>
    {mood && <span className="mood-pill" style={{ background: mood.background }}>
      {mood.emoji}
      {mood.label}
    </span>}
  </div>
  <h3>{entry.title}</h3>
  <p>{entry.content}</p>
  <div className="entry-bottom">
    <div className="entry-tags">{entry.tags.slice(0, 2).map(t => <span key={t}>#{t}</span>)}</div>
    <ArrowRight size={15}/>
  </div>
    </Link>;
}
export function DiaryPage() {
    const { data } = useApp();
    const [query, setQuery] = useState('');
    const [mood, setMood] = useState('all');
    const [sort, setSort] = useState('newest');
    const [date, setDate] = useState('');
    const entries = (data?.entries || []).filter(e => (e.title + ' ' + e.content + ' ' + e.tags.join(' ')).toLowerCase().includes(query.toLowerCase()) && (mood === 'all' || e.mood === mood) && (!date || e.date === date)).sort((a, b) => sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return <div id="main-content" className="page-enter">
  <div className="page-heading">
    <div>
      <span className="eyebrow">YOUR WORDS. YOUR WORLD.</span>
      <h1>Pages of your story <span className="heading-flower">❀</span></h1>
      <p>A place for the messy, the magical, and everything in between.</p>
    </div>
    <Link href="/diary/new" className="button button-primary"><PenLine size={16}/> Write a new entry</Link>
  </div>
  <div className="diary-banner">
    <Feather size={32}/>
    <div>
      <h2>You don’t need the perfect words.</h2>
      <p>Just a little honesty, and a moment to yourself.</p>
    </div>
    <span><LockKeyhole size={14}/> Only you can read these pages</span>
  </div>
  <div className="diary-toolbar">
    <div className="search-input">
      <Search size={17}/>
      <Input aria-label="Search diary" placeholder="Find a thought, a moment, a memory…" value={query} onChange={e => setQuery(e.target.value)}/>
      {query && <button className="icon-button" aria-label="Clear search" onClick={() => setQuery('')}><X size={14}/></button>}
    </div>
    <select className="input filter-select" aria-label="Filter diary by mood" value={mood} onChange={e => setMood(e.target.value)}>
      <option value="all">All moods</option>
      {moods.map(m => <option key={m.id} value={m.id}>
        {m.emoji}
        {m.label}
      </option>)}
    </select>
    <Input className="diary-date-filter" type="date" aria-label="Filter diary by date" value={date} onChange={e => setDate(e.target.value)}/>
    <select className="input filter-select" aria-label="Sort entries" value={sort} onChange={e => setSort(e.target.value)}>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>
  </div>
  <div className="collection-label">{entries.length} {entries.length === 1 ? 'moment' : 'moments'} kept close {(query || mood !== 'all' || date) && <button className="text-button" onClick={() => {
        setQuery('');
        setMood('all');
        setDate('');
    }}>Clear filters</button>}</div>
  {entries.length ? <div className="diary-grid">{entries.map(e => <EntryCard key={e.id} entry={e}/>)}</div> : <div className="card empty-state">
    <span className="empty-icon"><BookOpen size={34}/></span>
    <h2>{data?.entries.length ? 'No moments found just yet.' : 'Your first page is waiting.'}</h2>
    <p>{data?.entries.length ? 'Try another word or change your filters.' : 'Start with how you feel, a little gratitude, or simply what happened today.'}</p>
    {!data?.entries.length && <Link href="/diary/new" className="button button-primary"><PenLine size={16}/> Write my first entry</Link>}
  </div>}
    </div>;
}
export function DiaryEditor({ id }: {
    id?: string;
}) {
    const { data, refresh } = useApp();
    const entry = data?.entries.find(e => e.id === id);
    const params = useSearchParams();
    const initialDate = dateSchema.safeParse(params.get('date'));
    const router = useRouter();
    const [title, setTitle] = useState(entry?.title || '');
    const [content, setContent] = useState(entry?.content || '');
    const [date, setDate] = useState(entry?.date || (initialDate.success ? initialDate.data : localDate()));
    const [mood, setMood] = useState(entry?.mood || '');
    const [tags, setTags] = useState(entry?.tags.join(', ') || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [leave, setLeave] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [pendingHref, setPendingHref] = useState('/diary');
    useEffect(() => {
        if (!dirty)
            return;
        const prevent = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        const click = (e: MouseEvent) => {
            const a = (e.target as HTMLElement).closest('a');
            if (a?.href && new URL(a.href).origin === location.origin && new URL(a.href).pathname !== location.pathname) {
                e.preventDefault();
                setPendingHref(a.href);
                setLeave(true);
            }
        };
        window.addEventListener('beforeunload', prevent);
        document.addEventListener('click', click, true);
        return () => {
            window.removeEventListener('beforeunload', prevent);
            document.removeEventListener('click', click, true);
        };
    }, [dirty]);
    async function save() {
        setError('');
        const parsed = diarySchema.safeParse({ title, content, date, mood: mood || null, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
        if (!parsed.success) {
            setError(parsed.error.issues[0].message);
            return;
        }
        setBusy(true);
        try {
            const result = await request(id ? `/api/diary/${id}` : '/api/diary', id ? 'PUT' : 'POST', parsed.data);
            setDirty(false);
            await refresh();
            toast.success('Your words have a home. Entry saved.');
            router.push(`/diary/${id || result.id}`);
        }
        catch (e) {
            notifyError(e);
        }
        finally {
            setBusy(false);
        }
    }
    if (id && !entry)
        return <div className="empty-state">
  <h2>This page couldn’t be found.</h2>
  <Link href="/diary">Return to my diary</Link>
        </div>;
    return <div id="main-content" className="page-enter editor-page">
  <div className="editor-toolbar">
    <Link className="text-button" href="/diary"><ArrowLeft size={16}/> Back to my diary</Link>
    <span className="editor-private"><LockKeyhole size={13}/> Your private little space</span>
    <Button disabled={busy} onClick={() => void save()}>
      {busy ? <LoaderCircle className="spin" size={16}/> : <Check size={16}/>}
      {busy ? 'Saving…' : 'Save my entry'}
    </Button>
  </div>
  <div className="editor-paper">
    <span className="eyebrow">{id ? 'REVISIT A LITTLE MOMENT' : 'A FRESH PAGE. A LITTLE POSSIBILITY.'}</span>
    <Input className="editor-title" placeholder="Give this moment a name…" value={title} aria-label="Entry title" maxLength={150} onChange={e => {
        setTitle(e.target.value);
        setDirty(true);
    }}/>
    <div className="editor-metadata">
      <label>
        <CalendarDays size={15}/>
        <Input aria-label="Entry date" type="date" value={date} onChange={e => {
        setDate(e.target.value);
        setDirty(true);
    }}/>
      </label>
      <select className="small-select" aria-label="Entry mood" value={mood} onChange={e => {
        setMood(e.target.value);
        setDirty(true);
    }}>
        <option value="">How does this moment feel?</option>
        {moods.map(m => <option key={m.id} value={m.id}>
          {m.emoji}
          {m.label}
        </option>)}
      </select>
    </div>
    {!content && <div className="writing-prompt"><Sparkle /> Need a starting point? <button onClick={() => {
        setContent('Today, I’m grateful for ');
        setDirty(true);
    }}>Today, I’m grateful for…</button></div>}
    <textarea className="editor-content" aria-label="Diary content" placeholder={"Dear diary,\n\nTake a breath. Let it all out.\nThis page is here to listen…"} value={content} maxLength={50000} onChange={e => {
        setContent(e.target.value);
        setDirty(true);
    }}/>
    <div className="editor-tags">
      <Tag size={16}/>
      <Input aria-label="Tags, separated by commas" placeholder="Add a few tags, separated by commas (gratitude, little wins…)" value={tags} onChange={e => {
        setTags(e.target.value);
        setDirty(true);
    }}/>
    </div>
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="editor-footnote">
      <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words · {dirty ? 'Unsaved thoughts' : 'A little space to just be'}</span>
      <span>No perfect words needed. Just yours.</span>
    </div>
  </div>
  <Dialog open={leave} onOpenChange={setLeave}><DialogContent>
      <DialogTitle className="dialog-title">Keep your words close?</DialogTitle>
      <DialogDescription className="muted">You have unsaved thoughts. Save your entry before leaving to keep them.</DialogDescription>
      <div className="dialog-actions">
        <Button variant="outline" onClick={() => setLeave(false)}>Keep writing</Button>
        <Button variant="destructive" onClick={() => {
        setDirty(false);
        setLeave(false);
        router.push(pendingHref);
    }}>Leave without saving</Button>
      </div>
    </DialogContent></Dialog>
    </div>;
}
function Sparkle() {
    return <span aria-hidden="true">✧</span>;
}
export function DiaryDetail({ id }: {
    id: string;
}) {
    const { data, refresh } = useApp();
    const entry = data?.entries.find(e => e.id === id);
    const [confirm, setConfirm] = useState(false);
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    async function remove() {
        setBusy(true);
        try {
            await request(`/api/diary/${id}`, 'DELETE');
            await refresh();
            toast.success('Entry deleted. Make room for your next chapter.');
            router.push('/diary');
        }
        catch (e) {
            notifyError(e);
        }
        finally {
            setBusy(false);
        }
    }
    if (!entry)
        return <div className="empty-state">
  <h2>This moment couldn’t be found.</h2>
  <Link href="/diary" className="button button-outline">Return to my diary</Link>
        </div>;
    const mood = findMood(entry.mood);
    return <div id="main-content" className="page-enter editor-page">
  <div className="editor-toolbar">
    <Link className="text-button" href="/diary"><ArrowLeft size={16}/> Back to my diary</Link>
    <div className="inline-actions">
      <Button variant="ghost" size="icon" aria-label="Delete entry" onClick={() => setConfirm(true)}><Trash2 size={17}/></Button>
      <Button variant="outline" asChild><Link href={`/diary/${id}/edit`}><PenLine size={15}/> Edit entry</Link></Button>
    </div>
  </div>
  <article className="editor-paper diary-reading">
    <span className="eyebrow">A LITTLE MOMENT, KEPT CLOSE</span>
    <h1>{entry.title}</h1>
    <div className="reading-meta">
      <span>
        <CalendarDays size={14}/>
        {readableDate(entry.date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
      {mood && <span className="mood-pill" style={{ background: mood.background }}>
        {mood.emoji}
        {mood.label}
      </span>}
    </div>
    <div className="reading-content">{entry.content}</div>
    <div className="entry-tags">{entry.tags.map(t => <span key={t}>#{t}</span>)}</div>
    <div className="reading-footer"><LockKeyhole size={13}/> Just between you and your diary.</div>
  </article>
  <Dialog open={confirm} onOpenChange={setConfirm}><DialogContent>
      <DialogTitle className="dialog-title">Let this page go?</DialogTitle>
      <DialogDescription className="muted">“{entry.title}” will be permanently deleted. This cannot be undone.</DialogDescription>
      <div className="dialog-actions">
        <Button variant="outline" onClick={() => setConfirm(false)}>Keep this moment</Button>
        <Button variant="destructive" disabled={busy} onClick={() => void remove()}>{busy ? 'Deleting…' : 'Delete entry'}</Button>
      </div>
    </DialogContent></Dialog>
    </div>;
}
