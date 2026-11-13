'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { moods } from '@/lib/catalog';
import { localDate } from '@/lib/utils';
import { useApp, request, notifyError } from './providers';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input, Textarea } from './ui/input';
import { Check, ArrowRight, Heart, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
export function MoodChoices({ value, onChange }: {
    value: string;
    onChange: (mood: string) => void;
}) {
    const reducedMotion = useReducedMotion();
    return <div className="mood-choices" role="group" aria-label="Choose your mood">{moods.map(m => <motion.button whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} type="button" key={m.id} onClick={() => onChange(m.id)} aria-pressed={value === m.id} className={`mood-choice ${value === m.id ? 'selected' : ''}`} style={{ '--mood-bg': m.background, '--mood-color': m.color } as React.CSSProperties}>
    <span className="mood-emoji">{m.emoji}</span>
    <span>{m.label}</span>
    {value === m.id && <Check className="mood-check" size={12}/>}
  </motion.button>)}</div>;
}
export function MoodPicker({ full = false }: {
    full?: boolean;
}) {
    const { data, refresh } = useApp();
    const today = localDate();
    const current = data?.moods.find(m => m.date === today);
    const [selected, setSelected] = useState(current?.mood || '');
    const [note, setNote] = useState(current?.note || '');
    const [date, setDate] = useState(today);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const onDate = (date: string) => {
        setDate(date);
        const record = data?.moods.find(m => m.date === date);
        setSelected(record?.mood || '');
        setNote(record?.note || '');
    };
    async function save() {
        if (!selected) {
            toast.error('Pick a feeling to get started.');
            return;
        }
        setBusy(true);
        try {
            await request('/api/moods', 'POST', { date, mood: selected, note });
            await refresh();
            toast.success('A little check-in, a little more self-awareness. Mood saved.');
            setOpen(false);
        }
        catch (e) {
            notifyError(e);
        }
        finally {
            setBusy(false);
        }
    }
    const fields = <>
  <MoodChoices value={selected} onChange={setSelected}/>
  <label className="field-label" htmlFor={full ? 'mood-note-full' : 'mood-note'}>Want to put it into words? <span>(optional)</span></label>
  <Textarea id={full ? 'mood-note-full' : 'mood-note'} placeholder="What’s on your mind? There’s no right or wrong answer…" value={note} onChange={e => setNote(e.target.value)} maxLength={500} rows={3}/>
  <div className="form-meta">
    <span>{note.length}/500</span>
    <span><Heart size={12}/> Every feeling is welcome here.</span>
  </div>
    </>;
    if (full)
        return <section className="card mood-full">
  <div className="section-heading">
    <div>
      <span className="eyebrow">PAUSE. BREATHE. CHECK IN.</span>
      <h2>How are you feeling?</h2>
    </div>
    <Input type="date" aria-label="Mood date" value={date} max={today} onChange={e => onDate(e.target.value)} className="date-input"/>
  </div>
  <p className="muted">Some days are sunshine, some are a little cloudy. All of them belong.</p>
  {fields}
  <Button disabled={busy || !selected} onClick={() => void save()}>
    {busy ? <LoaderCircle className="spin" size={16}/> : <Check size={16}/>}
    {data?.moods.some(m => m.date === date) ? 'Update my check-in' : 'Save my check-in'}
  </Button>
        </section>;
    return <>
  <div className="section-heading">
    <div>
      <h2>How’s your heart today?</h2>
      <p>A small check-in can make a big difference.</p>
    </div>
    <span className="soft-badge">DAILY CHECK-IN</span>
  </div>
  <MoodChoices value={current?.mood || selected} onChange={m => {
        setSelected(m);
        setDate(today);
        setNote(current?.note || '');
        setOpen(true);
    }}/>
  <div className="mood-footer">
    <span>{current ? <><Check size={14}/> You checked in today. Tap a mood to update.</> : <>Your feelings matter. Give them a little space.</>}</span>
    <button className="text-button" onClick={() => setOpen(true)}>
      {current ? 'Edit check-in' : 'Add a little note'}
      <ArrowRight size={14}/>
    </button>
  </div>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent>
      <DialogTitle className="dialog-title">A moment to check in</DialogTitle>
      <DialogDescription className="muted">Meet yourself exactly where you are today.</DialogDescription>
      {fields}
      <Button className="w-full" disabled={busy || !selected} onClick={() => void save()}>{busy ? <LoaderCircle className="spin" size={16}/> : <Heart size={16}/>}Save my mood</Button>
    </DialogContent></Dialog>
    </>;
}
