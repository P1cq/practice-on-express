import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="dot-title text-3xl md:text-5xl text-white mb-6">About sarihnaa</h1>
          <div className="space-y-6 text-sage-200 leading-relaxed">
            <p>
              sarihnaa is an anonymous messaging platform inspired by the courage it takes to be
              honest. We believe that sometimes the most valuable feedback comes when people feel
              safe enough to speak freely.
            </p>
            <p>
              Whether you want to receive anonymous messages from friends, colleagues, or followers,
              or send a thoughtful message to someone else, sarihnaa provides a secure and
              respectful space for authentic communication.
            </p>
            <div className="bg-sage-800 rounded-2xl p-6 md:p-8 mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">How it works</h2>
              <ol className="space-y-4 list-decimal list-inside text-sm md:text-base">
                <li>Create your free account and verify your email</li>
                <li>Share your unique link with others</li>
                <li>Receive anonymous messages in your inbox</li>
                <li>Get real-time notifications when new messages arrive</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
