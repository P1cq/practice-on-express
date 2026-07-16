import Header from '../components/Header';
import Footer from '../components/Footer';

const STEPS = [
  {
    title: 'Create your account and verify your email',
    body: 'It takes a minute — a name, an email, a password. We send a six-digit code to confirm it\'s really you.',
  },
  {
    title: 'Share your link',
    body: 'Every account gets a private link. Put it in your bio, send it to a friend, or drop it wherever people already talk to you.',
  },
  {
    title: 'Notes arrive in your inbox',
    body: 'Anyone with your link can write to you — no account required on their end, no name attached to what they send.',
  },
  {
    title: 'Read them when you\'re ready',
    body: 'A quiet notification lets you know something\'s waiting. Open it when the moment is right.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-4 text-center">
            About sarihnaa
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-ink-900 text-center leading-tight mb-10 text-balance">
            A place for the words that are easier to write than to say.
          </h1>

          <div className="space-y-5 text-ink-700 leading-relaxed text-[15px] md:text-base">
            <p>
              sarihnaa started from a simple observation: the most honest feedback people ever
              give each other rarely happens face to face. It happens in a note passed quietly,
              a message sent without a signature — because taking the name off the bottom is
              sometimes what makes the truth possible at all.
            </p>
            <p>
              Whether you're waiting to hear something honest from the people around you, or you
              have something kind — or difficult — to say to someone else, sarihnaa is built to
              carry that message safely, without asking either of you to put your name on it.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="font-display italic text-xl text-ink-900 mb-6">How it works</h2>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="note-card p-6 flex gap-5">
                  <span className="font-display italic text-pine-700 text-2xl leading-none shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
