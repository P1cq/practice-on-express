import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

const FEATURES = [
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

            <div>
              <FoldedNoteIllustration />
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-4xl mx-auto card-paper rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 justify-center text-center sm:text-left">
            <div className="font-display text-4xl md:text-5xl text-pine-800 leading-none">
              500,000
            </div>
            <p className="text-ink-700 text-sm md:text-base leading-relaxed max-w-sm">
              notes are folded and sent through sarihnaa every day — each one honest,
              none of them signed.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display italic text-2xl md:text-3xl text-ink-900 text-center mb-12">
              How a note travels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
              {FEATURES.map((f, i) => (
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
