import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

function FoldedNoteIllustration() {
  return (
    <svg viewBox="0 0 420 340" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <ellipse cx="210" cy="300" rx="140" ry="16" fill="rgba(33,31,22,0.08)" />

      {/* envelope body */}
      <rect x="70" y="90" width="280" height="180" rx="10" fill="#f4eede" stroke="#d8caa4" strokeWidth="2" />
      {/* envelope flap shadow */}
      <path d="M70 100 L210 210 L350 100" fill="none" stroke="#d8caa4" strokeWidth="2" />
      <path d="M72 98 L210 205 L348 98 L348 100 L210 210 L72 100 Z" fill="rgba(33,31,22,0.04)" />

      {/* the note peeking out, top */}
      <g transform="translate(130 20) rotate(-4 80 80)">
        <rect x="0" y="0" width="160" height="120" rx="6" fill="#fbf8f0" stroke="#c2b087" strokeWidth="1.5" />
        <line x1="20" y1="30" x2="140" y2="30" stroke="#e0d3ae" strokeWidth="2" />
        <line x1="20" y1="48" x2="140" y2="48" stroke="#e0d3ae" strokeWidth="2" />
        <line x1="20" y1="66" x2="100" y2="66" stroke="#e0d3ae" strokeWidth="2" />
      </g>

      {/* wax seal */}
      <circle cx="210" cy="180" r="26" fill="#235a4d" />
      <circle cx="210" cy="180" r="26" fill="none" stroke="#143530" strokeWidth="1.5" />
      <path
        d="M210 168 L215 178 L226 179 L217.5 186 L220 197 L210 191 L200 197 L202.5 186 L194 179 L205 178 Z"
        fill="#e0ede8"
      />
    </svg>
  );
}

function ToggleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <rect x="2.5" y="7.5" width="19" height="9" rx="4.5" strokeWidth={1.5} />
      <circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" strokeWidth={1.5} />
      <circle cx="8.5" cy="9.5" r="1.5" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 17l5-5 3.5 3.5L17 10l3.5 3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.998 11.998 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

const HOW_IT_WORKS = [
  {
    title: 'Written, not spoken',
    body: 'Some truths come out easier with a pen than a voice. Take your time — there is no reply expected in the moment.',
  },
  {
    title: 'Delivered without a name',
    body: 'Your identity never travels with the note. Not to us, not to the person reading it.',
  },
  {
    title: 'Kept until they’re ready',
    body: 'Every note lands safely in their inbox and waits — read when the moment is right, not before.',
  },
];

const PREVIEW_NOTES = [
  {
    badge: 'Received',
    from: 'Anonymous',
    time: 'Today, 9:14 AM',
    content: "I don't say this enough, but the way you handled last week's mess made me want to work harder for this team.",
  },
  {
    badge: 'Received',
    from: 'Anonymous',
    time: 'Yesterday, 6:40 PM',
    content: 'You probably don\'t remember, but you were kind to me on a genuinely bad day two years ago. I still think about it.',
  },
  {
    badge: 'Sent',
    from: 'To: a friend',
    time: 'Monday, 11:02 AM',
    content: "I'm proud of you for the decision you made, even if I never say it out loud when we talk.",
  },
];

const CAPABILITIES = [
  {
    title: 'Two ways to send',
    body: 'Stay fully anonymous, or attach your name if the moment calls for it. The choice is yours, every single time.',
    Icon: ToggleIcon,
    featured: true,
  },
  {
    title: 'A photo says more',
    body: 'Attach an image when words alone aren\'t quite enough.',
    Icon: PhotoIcon,
  },
  {
    title: 'Know the moment it lands',
    body: 'A quiet, real-time notification the instant a note arrives.',
    Icon: BellIcon,
  },
  {
    title: 'One tap with Google',
    body: 'Sign in or create an account instantly — no new password to invent or forget.',
    Icon: GoogleIcon,
    wide: true,
  },
];

const TESTIMONIALS = [
  {
    quote: 'I told my old professor she changed the course of my career — nineteen years late, and only because I could send it without my name on it.',
    attribution: 'an anonymous note, sent to a teacher',
  },
  {
    quote: "My sister doesn't know it was me. She just knows someone is proud of her.",
    attribution: 'an anonymous note, sent to family',
  },
  {
    quote: 'Six words, no signature. Still the most honest thing I said all year.',
    attribution: 'an anonymous note, sent to a friend',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="paper-grain px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="text-center lg:text-left">
              <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-5">
                An anonymous letterbox
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-[3.4rem] text-ink-900 leading-[1.08] text-balance mb-6">
                Some things are easier to say <em className="italic text-pine-800">on paper.</em>
              </h1>
              <p className="text-ink-700 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-9">
                Write it. Fold it. Send it without your name attached. sarihnaa carries the
                words people mean but rarely say out loud.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="btn-primary inline-block px-9 py-3.5 text-sm">
                  Start writing
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium text-ink-700 hover:text-pine-800 transition-colors underline decoration-paper-300 underline-offset-4"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div className="float-gentle">
              <FoldedNoteIllustration />
            </div>
          </div>
        </section>

        <Reveal className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-4xl mx-auto card-paper rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 justify-center text-center sm:text-left">
            <div className="font-display text-4xl md:text-5xl text-pine-800 leading-none">
              500,000
            </div>
            <p className="text-ink-700 text-sm md:text-base leading-relaxed max-w-sm">
              notes are folded and sent through sarihnaa every day — each one honest,
              none of them signed.
            </p>
          </div>
        </Reveal>

        {/* Product preview: a peek at a real inbox, framed like an app window */}
        <Reveal className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-4">
                Inside your inbox
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-ink-900 leading-tight mb-4 text-balance">
                Every note, kept exactly as it arrived.
              </h2>
              <p className="text-ink-700 text-sm md:text-base leading-relaxed">
                Received and sent notes live side by side, each one timestamped and
                clearly marked — so you always know what you're looking at, and who it was for.
              </p>
            </div>

            <div className="max-w-2xl mx-auto rounded-2xl border border-paper-300 bg-paper-50 shadow-2xl shadow-black/10 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-paper-200 bg-paper-200/60">
                <span className="w-2.5 h-2.5 rounded-full bg-paper-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper-400" />
                <span className="ml-3 text-xs text-ink-400 font-medium">sarihnaa — your letterbox</span>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                {PREVIEW_NOTES.map((note) => (
                  <div key={note.content} className="note-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          note.badge === 'Received' ? 'bg-pine-100 text-pine-800' : 'bg-ochre-100 text-ochre-700'
                        }`}
                      >
                        {note.badge}
                      </span>
                      <span className="text-xs text-ink-400">{note.time}</span>
                    </div>
                    <p className="text-ink-900 text-sm leading-relaxed">{note.content}</p>
                    <p className="text-xs text-ink-400 mt-2">{note.from}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display italic text-2xl md:text-3xl text-ink-900 text-center mb-12">
              How a note travels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
              {HOW_IT_WORKS.map((f, i) => (
                <div key={f.title} className="note-card card-lift p-7">
                  <span className="font-display italic text-pine-700 text-2xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Capabilities — bento grid */}
        <Reveal className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold text-center mb-4">
              What's included
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-ink-900 text-center mb-12 text-balance">
              Everything a quiet inbox needs, nothing it doesn't.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
              {CAPABILITIES.map(({ title, body, Icon, featured, wide }) => (
                <div
                  key={title}
                  className={`card-paper card-lift rounded-2xl p-7 ${featured ? 'md:col-span-2' : ''} ${
                    wide ? 'md:col-span-4 flex items-center gap-6' : ''
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-pine-100 text-pine-800 flex items-center justify-center shrink-0 ${wide ? '' : 'mb-4'}`}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Testimonials — pinned like notes on a board */}
        <Reveal className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 pt-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display italic text-2xl md:text-3xl text-ink-900 text-center mb-16">
              Notes people actually sent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.quote} className="pin-card note-card p-7 flex flex-col shadow-lg shadow-black/5">
                  <span className="font-display italic text-pine-700 text-3xl leading-none mb-3">
                    &ldquo;
                  </span>
                  <p className="font-display text-ink-900 text-base leading-snug flex-1">
                    {t.quote}
                  </p>
                  <p className="text-xs text-ink-400 mt-5">{t.attribution}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Closing CTA */}
        <Reveal className="pine-panel px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-paper-50 leading-tight mb-4 text-balance">
              Write the note you've been sitting on.
            </h2>
            <p className="text-pine-200 text-sm md:text-base mb-9">
              It takes less time to send than it did to read this page.
            </p>
            <Link
              to="/signup"
              className="inline-block px-9 py-3.5 bg-paper-50 text-pine-900 rounded-full text-sm font-semibold hover:bg-white transition-colors"
            >
              Create your account
            </Link>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
