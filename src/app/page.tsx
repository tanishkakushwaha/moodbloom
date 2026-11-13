import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Heart, Smile, BookOpen, ChartNoAxesCombined, ShieldCheck, Sparkles, Check, Leaf, Quote } from 'lucide-react';
import { Brand, Botanical, Flower } from '@/components/brand';
import { moods } from '@/lib/catalog';
import { Reveal } from '@/components/motion';
export default function LandingPage() {
    return <div className="landing">
  <header className="landing-nav">
    <Brand />
    <nav aria-label="Website navigation">
      <a href="#features">A space for you</a>
      <a href="#how-it-works">How it works</a>
      <a href="#kind-words">Kind words</a>
    </nav>
    <div>
      <Link href="/login" className="landing-login">Log in</Link>
      <Link href="/signup" className="button button-primary button-sm">Start your journey <ArrowUpRight size={14}/></Link>
    </div>
  </header>
  <main id="main-content">
    <section className="landing-hero">
      <Reveal className="hero-copy">
        <span className="hero-pill"><span /> A LITTLE SELF-CARE. A LITTLE MORE YOU.</span>
        <h1>Your feelings<br />deserve a <span>place.<svg viewBox="0 0 250 20" fill="none" aria-hidden="true"><path d="M5 13Q115-5 245 10M15 19Q130 4 235 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span></h1>
        <p>A peaceful home for your moods, your stories, and your everyday moments. Slow down, check in, and grow into yourself — one little day at a time.</p>
        <div className="hero-actions">
          <Link href="/signup" className="button button-primary">Start Your Journey <ArrowRight size={17}/></Link>
          <a href="#features" className="button button-outline">Explore Features <ArrowUpRight size={16}/></a>
        </div>
        <div className="hero-reassurance">
          <ShieldCheck size={15}/>
          <span>Private by nature.</span>
          <span className="tiny-dot"/>
          <span>Gentle by design.</span>
        </div>
        <div className="hero-note">
          <span>✿</span>
          <p>You don’t need to have it all figured out.<br /><b>Just come as you are.</b></p>
        </div>
      </Reveal>
      <div className="hero-visual" aria-label="Preview of Mood & Dairy’s mood tracker and diary">
        <span className="hero-visual-glow"/>
        <span className="floating-label label-top"><Sparkles size={15}/> A moment to just be.</span>
        <div className="hero-botanical"><Botanical /></div>
        <div className="mock-card mock-moods">
          <div className="mock-card-heading">
            <span className="mock-icon"><Heart size={17}/></span>
            <span>A LITTLE CHECK-IN</span>
            <span>✧</span>
          </div>
          <h3>How’s your heart today?</h3>
          <p>Every feeling is welcome here.</p>
          <div className="mock-mood-grid">{moods.slice(0, 4).map(m => <div key={m.id} className={m.id === 'calm' ? 'mock-selected' : ''} style={{ background: m.background }}>
              <span>{m.emoji}</span>
              <b>{m.label}</b>
              {m.id === 'calm' && <i><Check size={9}/></i>}
            </div>)}</div>
          <div className="mock-note">A slow morning, a warm cup of tea.<br />Feeling a little more like myself today. ☁️</div>
          <div className="mock-saved"><span /> A little feeling, acknowledged.</div>
        </div>
        <div className="mock-card mock-diary">
          <span className="eyebrow"><BookOpen size={12}/> A PAGE FROM MY STORY</span>
          <h3>The beauty in<br />the little things.</h3>
          <p>Today I noticed the sunlight on my windowsill. The way my coffee warmed my hands. Sometimes, that’s enough.</p>
          <span className="mock-tag">#gratitude</span>
          <span className="mock-tag">#littlejoys</span>
          <div className="mock-diary-footer">
            <span>Just for me.</span>
            <Heart size={14}/>
          </div>
        </div>
        <span className="floating-label label-bottom"><Leaf size={16}/> Growing, at my own pace.</span>
        <span className="floating-star star-one">✦</span>
        <span className="floating-star star-two">✧</span>
      </div>
    </section>
    <div className="landing-values">
      <span><Smile size={19}/> Room for every feeling</span>
      <i />
      <span><BookOpen size={19}/> Your words, held with care</span>
      <i />
      <span><ShieldCheck size={19}/> A space that’s only yours</span>
      <i />
      <span><Leaf size={19}/> Little steps. Meaningful growth.</span>
    </div>
    <section id="features" className="landing-section features-section">
      <div className="landing-section-heading">
        <span className="eyebrow">THOUGHTFULLY MADE FOR YOUR INNER WORLD</span>
        <h2>A little space.<br />A whole lot of <em>possibility.</em></h2>
        <p>Simple rituals to help you feel a little more connected to yourself.</p>
      </div>
      <div className="feature-grid">{[{ icon: Smile, title: 'Give your feelings a voice.', text: 'From happy and hopeful to tired and tangled. Check in with your mood, leave a note, and make room for it all.', className: 'feature-peach', label: 'DAILY MOOD TRACKING', art: '😊  😌  🥰  😴' }, { icon: BookOpen, title: 'Let your thoughts unfold.', text: 'A distraction-free diary for the things on your mind. Capture a moment, untangle a thought, or simply let it out.', className: 'feature-rose', label: 'YOUR PERSONAL DIARY', art: 'Dear diary, today I…' }, { icon: ChartNoAxesCombined, title: 'Notice your little patterns.', text: 'See your feelings come together in a beautiful calendar and gentle insights. Get to know yourself with curiosity.', className: 'feature-lavender', label: 'CALENDAR & INSIGHTS', art: '▂ ▄ ▃ ▅ ▆ ▄ ▇' }, { icon: Heart, title: 'Keep a little kindness close.', text: 'Find thoughtful words for the days you need them. Save your favorites, share a reminder, or carry it into your day.', className: 'feature-sage', label: 'DAILY INSPIRATION', art: '“ You are enough. ”' }].map(({ icon: Icon, ...f }) => <article key={f.title} className={`feature-card ${f.className}`}>
          <span className="feature-icon"><Icon size={23}/></span>
          <span className="eyebrow">{f.label}</span>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
          <div className="feature-art" aria-hidden="true">{f.art}</div>
        </article>)}</div>
    </section>
    <section id="how-it-works" className="landing-section how-section">
      <div className="landing-section-heading">
        <span className="eyebrow">A SMALL RITUAL. A SOFTER DAY.</span>
        <h2>Come back to <em>yourself.</em></h2>
        <p>No pressure. No perfect streaks. Just a little moment that’s yours.</p>
      </div>
      <div className="steps-grid">{[{ n: '01', title: 'Make yourself at home.', text: 'Create your private little space. Bring your whole, beautifully human self.' }, { n: '02', title: 'Check in, let it out.', text: 'Log a mood, write a few words, or find a gentle reminder. Follow what you need.' }, { n: '03', title: 'Grow at your own pace.', text: 'Look back, notice the little things, and celebrate the simple act of showing up.' }].map(s => <div className="step" key={s.n}>
          <span>{s.n}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </div>)}</div>
    </section>
    <section className="privacy-banner">
      <ShieldCheck size={35}/>
      <div>
        <h2>Some things are just for you.</h2>
        <p>Your diary and moods are private to your account. Your story is yours to tell, on your terms.</p>
      </div>
      <Link href="/privacy" className="text-button">How we care for your space <ArrowUpRight size={16}/></Link>
    </section>
    <section id="kind-words" className="landing-section testimonials-section">
      <div className="landing-section-heading">
        <span className="eyebrow">THE FEELING WE’RE HERE FOR</span>
        <h2>A softer way to <em>show up.</em></h2>
        <p>Illustrative testimonials below are placeholders, not real user reviews.</p>
      </div>
      <div className="testimonials">{[{ text: 'A small reminder to pause and actually ask myself how I’m doing. It feels like a deep breath at the end of a long day.', name: 'Aanya', desc: 'Making space for herself' }, { text: 'I used to think journaling needed to be profound. Here, a few honest sentences feel like enough. And that’s lovely.', name: 'Riya', desc: 'Finding her words' }, { text: 'Looking back at my moods has helped me notice the little things that bring me peace. One small day at a time.', name: 'Sam', desc: 'Growing gently' }].map((t, i) => <article key={t.name}>
          <Quote size={24}/>
          <blockquote>{t.text}</blockquote>
          <div>
            <span className={`testimonial-avatar avatar-${i}`}>{t.name[0]}</span>
            <span>
              <b>{t.name}</b>
              <small>{t.desc}</small>
            </span>
            <em>Sample</em>
          </div>
        </article>)}</div>
    </section>
    <section className="landing-cta">
      <Flower size={42}/>
      <span className="eyebrow">YOU DON’T HAVE TO DO IT ALL TODAY</span>
      <h2>Start with a little <em>you-time.</em></h2>
      <p>A thought. A feeling. A new beginning.<br />Your little space is waiting.</p>
      <Link href="/signup" className="button button-primary">Start Your Journey <ArrowRight size={17}/></Link>
      <small>A private space to grow. Come as you are.</small>
    </section>
  </main>
  <footer className="landing-footer">
    <div>
      <Brand />
      <p>For your beautifully human days.</p>
    </div>
    <nav aria-label="Footer">
      <a href="#features">Features</a>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/login">My space <ArrowUpRight size={13}/></Link>
    </nav>
    <span>Made with care. <Heart size={13}/><br />© {new Date().getFullYear()} Mood & Dairy</span>
  </footer>
    </div>;
}
