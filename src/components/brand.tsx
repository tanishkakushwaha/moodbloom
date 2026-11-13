import Link from 'next/link';
import { APP_NAME } from '@/lib/branding';
export function Flower({ size = 32, className = '' }: {
    size?: number;
    className?: string;
}) {
    return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
  {[0, 60, 120, 180, 240, 300].map(r => <ellipse key={r} cx="24" cy="13" rx="7.5" ry="12" transform={`rotate(${r} 24 24)`} fill="currentColor" opacity=".85"/>)}
  <circle cx="24" cy="24" r="6" fill="#f8ebd1"/>
    </svg>;
}
export function Brand() {
    return <Link className="brand" href="/" aria-label={APP_NAME}>
  <Flower />
  <span className="brand-name">{APP_NAME}</span>
    </Link>;
}
export function Botanical({ className = '' }: {
    className?: string;
}) {
    return <svg className={className} viewBox="0 0 380 350" fill="none" aria-hidden="true">
  <path d="M183 340C190 248 218 210 201 115M187 280C136 234 110 191 104 124M192 236C253 203 279 144 280 80" stroke="#8e9c7b" strokeWidth="3" strokeLinecap="round"/>
  {[[160, 246, -50], [123, 203, -48], [110, 156, -48], [217, 214, 50], [252, 170, 47], [275, 114, 25], [196, 169, -20], [204, 126, 20]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="34" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? '#b8c0a1' : '#929f82'} opacity=".85"/>)}
  {[[202, 86, 1], [102, 102, .8], [282, 55, .7]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 60, 120, 180, 240, 300].map(r => <ellipse key={r} cx="0" cy="-22" rx="16" ry="26" transform={`rotate(${r})`} fill={i === 1 ? '#e7c9ab' : '#dbb0bb'}/>)}
    <circle r="14" fill="#eee0ae"/>
    <circle r="7" fill="#d6bf83"/>
  </g>)}
  <path d="M153 345H229L239 289H143L153 345Z" fill="#d1b49d"/>
  <path d="M144 291H239" stroke="#b89983" strokeWidth="6"/>
    </svg>;
}
