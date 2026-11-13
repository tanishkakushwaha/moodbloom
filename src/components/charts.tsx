'use client';

import { useId, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useApp } from './providers';
import { moods, findMood } from '@/lib/catalog';
import { localDate, readableDate } from '@/lib/utils';

type DayPoint = {
  date: string;
  label: string;
  score: number | null;
  feeling: string | null;
  emoji: string | null;
};

type MoodSlice = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  count: number;
};

function MoodTooltip({ active, payload }: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: DayPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point?.feeling) return null;
  return (
    <div className="chart-tooltip">
      <span>{readableDate(point.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      <b>{point.emoji} {point.feeling}</b>
    </div>
  );
}

function DistributionTooltip({ active, payload }: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: MoodSlice }>;
}) {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;
  return (
    <div className="chart-tooltip">
      <b>{slice.emoji} {slice.label}</b>
      <span>{slice.count} {slice.count === 1 ? 'check-in' : 'check-ins'}</span>
    </div>
  );
}

export function TrendChart({ large = false }: { large?: boolean }) {
  const { data } = useApp();
  const reducedMotion = useReducedMotion();
  const [period, setPeriod] = useState(7);
  const days: DayPoint[] = Array.from({ length: period }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (period - 1 - i));
    const date = localDate(day);
    const feeling = findMood(data?.moods.find(record => record.date === date)?.mood);
    return {
      date,
      label: day.toLocaleDateString('en', period === 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' }),
      score: feeling?.score ?? null,
      feeling: feeling?.label ?? null,
      emoji: feeling?.emoji ?? null,
    };
  });
  const known = days.filter(day => day.score !== null);
  const labels: Record<number, string> = { 1: 'A little low', 2: 'Low energy', 3: 'Okay', 4: 'Good', 5: 'Wonderful' };

  return (
    <div>
      <div className="section-heading">
        <div>
          <h2>Your emotional rhythm</h2>
          <p>A gentle look at how you’ve been feeling.</p>
        </div>
        <select aria-label="Trend period" className="small-select" value={period} onChange={event => setPeriod(Number(event.target.value))}>
          <option value={7}>This week</option>
          <option value={30}>This month</option>
        </select>
      </div>
      {known.length > 0 ? (
        <>
          <div className="recharts-trend" style={{ height: large ? 280 : 205 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={days} margin={{ top: 16, right: 14, left: 0, bottom: 5 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} minTickGap={period === 7 ? 0 : 28} dy={7} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} width={70} tick={{ fill: 'var(--muted)', fontSize: 9 }} tickFormatter={(value: number | string) => labels[Number(value)] ?? ''} />
                <Tooltip content={<MoodTooltip />} cursor={{ stroke: '#d6becf', strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="score" name="Daily mood" stroke="#b093c2" strokeWidth={2.5} connectNulls={false} dot={{ r: 4, fill: '#b093c2', stroke: 'var(--card)', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#b093c2', stroke: 'var(--card)', strokeWidth: 2 }} isAnimationActive={!reducedMotion} animationDuration={650} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only" aria-label="Logged moods in the selected period">
            {known.map(day => <li key={day.date}>{day.date}: {day.feeling}</li>)}
          </ul>
        </>
      ) : (
        <div className="chart-empty">
          <span>〰</span><p>Your story will take shape here.</p>
          <small>Log a mood to start seeing your emotional rhythm.</small>
        </div>
      )}
      <div className="chart-caption">
        <span className="legend-dot" /> Your daily check-ins
        <span className="chart-caption-end">Every feeling is part of your story.</span>
      </div>
    </div>
  );
}

export function DistributionChart() {
  const { data } = useApp();
  const reducedMotion = useReducedMotion();
  const [period, setPeriod] = useState('month');
  const chartId = useId();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (period === 'week' ? 6 : 29));
  const records = data?.moods.filter(record => record.date >= localDate(cutoff) && record.date <= localDate()) ?? [];
  const values: MoodSlice[] = moods.map(mood => ({
    ...mood, count: records.filter(record => record.mood === mood.id).length,
  })).filter(mood => mood.count > 0);

  return (
    <div className="card">
      <div className="section-heading">
        <div><h2>Your spectrum of feelings</h2><p>There’s room for every shade.</p></div>
        <select className="small-select" aria-label="Mood distribution period" value={period} onChange={event => setPeriod(event.target.value)}>
          <option value="month">30 days</option><option value="week">7 days</option>
        </select>
      </div>
      {records.length > 0 ? (
        <div className="distribution">
          <div className="recharts-donut" aria-describedby={chartId}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart accessibilityLayer>
                <Pie data={values} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={52} outerRadius={77} paddingAngle={values.length > 1 ? 3 : 0} stroke="none" isAnimationActive={!reducedMotion} animationDuration={650}>
                  {values.map(value => <Cell key={value.id} fill={value.color} />)}
                </Pie>
                <Tooltip content={<DistributionTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center" aria-hidden="true"><b>{records.length}</b><span>check-ins</span></div>
          </div>
          <div className="distribution-legend" id={chartId}>
            {values.map(value => (
              <div key={value.id}>
                <span style={{ background: value.color }} className="legend-dot" />
                <span>{value.emoji} {value.label}</span>
                <b title={`${value.count} check-ins`}>{Math.round(value.count / records.length * 100)}%</b>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chart-empty"><span>◌</span><p>Your feelings, in full color.</p><small>Your logged moods will appear here.</small></div>
      )}
    </div>
  );
}
