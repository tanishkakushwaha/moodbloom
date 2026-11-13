'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Smile, BookOpen, CalendarDays, Quote, ChartNoAxesCombined, Settings, LogOut, Menu, X, ArrowUpRight, Heart, Leaf } from 'lucide-react';
import { Brand, Flower } from './brand';
import { PageTransition } from './motion';
import { useApp, DataBoundary } from './providers';
const links = [{ href: '/dashboard', label: 'My sanctuary', icon: LayoutDashboard }, { href: '/mood-tracker', label: 'Mood tracker', icon: Smile }, { href: '/diary', label: 'My diary', icon: BookOpen }, { href: '/calendar', label: 'Mood calendar', icon: CalendarDays }, { href: '/quotes', label: 'Little inspirations', icon: Quote }, { href: '/insights', label: 'My insights', icon: ChartNoAxesCombined }];
export function Avatar({ name, image, size = 38 }: {
    name: string;
    image?: string | null;
    size?: number;
}) {
    const [failed, setFailed] = useState(false);
    useEffect(() => setFailed(false), [image]);
    return <span className="avatar" style={{ width: size, height: size }}>{image && !failed ? <img src={image} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)}/> : name.slice(0, 1).toUpperCase()}</span>;
}
export function AppShell({ children }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data } = useApp();
    const [menu, setMenu] = useState(false);
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const media = window.matchMedia('(max-width:760px)');
        const sync = () => setMobile(media.matches);
        sync();
        media.addEventListener('change', sync);
        const esc = (e: KeyboardEvent) => {
            if (e.key === 'Escape')
                setMenu(false);
        };
        window.addEventListener('keydown', esc);
        return () => {
            media.removeEventListener('change', sync);
            window.removeEventListener('keydown', esc);
        };
    }, []);
    const current = links.find(l => pathname.startsWith(l.href));
    return <div className="app-shell">
  <button className={`mobile-menu ${menu ? 'menu-open' : ''}`} aria-expanded={menu} aria-controls="main-sidebar" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? <X /> : <Menu />}</button>
  {menu && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenu(false)}/>}
  <aside id="main-sidebar" inert={mobile && !menu} className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
    <Brand />
    <div className="sidebar-caption">A LITTLE SPACE FOR YOU</div>
    <nav aria-label="Main navigation">{links.map(({ href, label, icon: Icon }) => <Link href={href} key={href} onClick={() => setMenu(false)} className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}>
        <Icon size={19}/>
        <span>{label}</span>
        {pathname.startsWith(href) && <span className="active-dot"/>}
      </Link>)}</nav>
    <div className="sidebar-bottom">
      <div className="grow-card">
        <Flower size={30}/>
        <p>One day at a time.<br />One little bloom at a time.</p>
        <span>You’re doing better than you think.</span>
      </div>
      <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} onClick={() => setMenu(false)}><Settings size={18}/>Settings</Link>
      <div className="sidebar-user">
        <Link href="/profile" className="profile-link" onClick={() => setMenu(false)}>
          <Avatar name={data?.user.name || 'You'} image={data?.user.image}/>
          <span>
            <b>{data?.user.name || 'Your space'}</b>
            <small>Growing at my own pace</small>
          </span>
        </Link>
        <button onClick={() => void signOut({ callbackUrl: '/' })} className="icon-button" aria-label="Log out"><LogOut size={17}/></button>
      </div>
    </div>
  </aside>
  <div className="app-main">
    <header className="app-topbar">
      <div className="breadcrumb">
        <Leaf size={15}/>
        <span>Your personal space</span>
        <span className="breadcrumb-divider">/</span>
        <b>{current?.label || (pathname === '/profile' ? 'My profile' : 'Settings')}</b>
      </div>
      <div className="topbar-right">
        <span className="private-tag"><span /> Just for you</span>
        <Link href="/profile" aria-label="View profile"><Avatar name={data?.user.name || 'You'} image={data?.user.image} size={33}/></Link>
      </div>
    </header>
    <main className="app-content">
      <DataBoundary><PageTransition>{children}</PageTransition></DataBoundary>
      <footer className="app-footer"><Heart size={12}/> Made for your beautifully human days.<span>Take a breath. You’re right where you need to be.</span></footer>
    </main>
  </div>
    </div>;
}
