import Link from 'next/link';
import { Flower } from '@/components/brand';
export default function NotFound() {
    return <main className="full-loading">
  <Flower size={48}/>
  <h1>A little off the garden path.</h1>
  <p>This page doesn’t exist, but your space is waiting.</p>
  <Link className="button button-primary" href="/dashboard">Back to my space</Link>
    </main>;
}
