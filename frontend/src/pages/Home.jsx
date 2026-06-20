import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ParrotsIllustration() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full max-w-md mx-auto drop-shadow-lg"
      aria-hidden="true"
    >
      <ellipse cx="200" cy="260" rx="120" ry="12" fill="rgba(0,0,0,0.15)" />
      <path
        d="M60 200 Q200 180 340 200"
        stroke="#c4b89a"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M80 200 Q200 160 320 200"
        stroke="#a89878"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <g transform="translate(130, 120)">
        <ellipse cx="40" cy="70" rx="35" ry="45" fill="#4a8c3f" />
        <ellipse cx="40" cy="75" rx="28" ry="38" fill="#5da84f" />
        <circle cx="55" cy="45" r="22" fill="#4a8c3f" />
        <circle cx="58" cy="42" r="18" fill="#5da84f" />
        <circle cx="65" cy="38" r="4" fill="#1a1a1a" />
        <circle cx="66" cy="37" r="1.5" fill="white" />
        <path d="M72 42 L85 38 L72 48 Z" fill="#e8a020" />
        <path d="M15 60 Q-5 40 5 20 Q15 35 25 50" fill="#3d7a35" />
        <path d="M60 110 Q30 130 20 160" stroke="#3d7a35" strokeWidth="3" fill="none" />
      </g>
      <g transform="translate(210, 100)">
        <ellipse cx="40" cy="75" rx="32" ry="42" fill="#3d7a35" />
        <ellipse cx="40" cy="78" rx="26" ry="35" fill="#4a8c3f" />
        <circle cx="52" cy="48" r="20" fill="#3d7a35" />
        <circle cx="54" cy="45" r="16" fill="#4a8c3f" />
        <circle cx="60" cy="42" r="3.5" fill="#1a1a1a" />
        <circle cx="61" cy="41" r="1.2" fill="white" />
        <path d="M66 46 L78 42 L66 52 Z" fill="#e8a020" />
        <path d="M70 55 Q90 35 85 15 Q78 30 72 48" fill="#2d5a28" />
        <path d="M55 115 Q80 135 90 165" stroke="#2d5a28" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

function KnittingIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto" aria-hidden="true">
      <circle cx="100" cy="40" r="20" fill="#6b8060" />
      <path d="M85 35 Q100 20 115 35" stroke="#a8b89e" strokeWidth="2" fill="none" />
      <rect x="60" y="70" width="80" height="90" rx="8" fill="#4a8c3f" />
      <path
        d="M80 100 A20 20 0 0 1 120 100 A20 20 0 0 1 80 100"
        fill="none"
        stroke="#ececec"
        strokeWidth="3"
      />
      <path
        d="M95 100 L100 90 L105 100 L110 90 L105 110 L100 120 L95 110 L90 100 Z"
        fill="none"
        stroke="#ececec"
        strokeWidth="2"
      />
      <line x1="50" y1="130" x2="70" y2="110" stroke="#c4b89a" strokeWidth="3" />
      <line x1="150" y1="130" x2="130" y2="110" stroke="#c4b89a" strokeWidth="3" />
    </svg>
  );
}

function PaperPlaneIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto" aria-hidden="true">
      <path
        d="M30 120 Q80 100 130 80 Q160 70 170 60"
        stroke="#a8b89e"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 4"
      />
      <path d="M140 50 L170 60 L150 80 L155 65 Z" fill="#3d5236" />
      <path d="M140 50 L120 90 L155 65 Z" fill="#4a6354" />
      <path d="M140 50 L100 70 L120 90 Z" fill="#5a6e52" opacity="0.7" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header variant="home" />

      <main className="flex-1">
        <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="dot-title text-4xl sm:text-5xl md:text-7xl text-center text-white mb-2 md:mb-4">
              sarihnaa
            </h1>

            <div className="relative -mt-4 md:-mt-8 mb-8 md:mb-12">
              <ParrotsIllustration />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start max-w-5xl mx-auto">
              <div className="text-center md:text-right order-2 md:order-1">
                <p className="text-sage-200 text-sm leading-relaxed mb-4">
                  Because honesty takes courage,
                  <br />
                  we made it anonymous.
                </p>
                <div className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
                  <span className="block">500K</span>
                  <span className="block text-lg sm:text-xl md:text-2xl text-sage-200 font-body font-normal">
                    Daily Messages
                  </span>
                </div>
              </div>

              <div className="hidden md:block order-2" />

              <div className="text-center md:text-left order-1 md:order-3">
                <p className="text-sage-200 text-sm leading-relaxed mb-6">
                  Expect the unexpected.
                  <br />
                  Write your secret message now.
                </p>
                <Link
                  to="/signup"
                  className="inline-block px-10 py-3.5 bg-sage-100 text-sage-900 rounded-full text-sm font-semibold hover:bg-white transition-all hover:scale-105 shadow-lg"
                >
                  get started
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="bg-sage-700 rounded-[2rem] p-8 md:p-10 aspect-square flex flex-col items-center justify-center hover:scale-[1.02] transition-transform cursor-pointer group">
              <KnittingIllustration />
              <h3 className="mt-6 text-lg font-semibold text-sage-100 group-hover:text-white transition-colors">
                Sustainable Connections
              </h3>
              <p className="mt-2 text-sm text-sage-200 text-center leading-relaxed">
                Build meaningful anonymous conversations that last.
              </p>
            </div>

            <div className="bg-sage-800 rounded-[2rem] p-8 md:p-10 aspect-square flex flex-col items-center justify-center hover:scale-[1.02] transition-transform cursor-pointer group">
              <PaperPlaneIllustration />
              <h3 className="mt-6 text-lg font-semibold text-sage-100 group-hover:text-white transition-colors">
                Send Instantly
              </h3>
              <p className="mt-2 text-sm text-sage-200 text-center leading-relaxed">
                Your message flies straight to its destination, anonymously.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
