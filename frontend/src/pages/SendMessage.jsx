import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers } from '../api/user';
import { sendAnonymousMessage } from '../api/messages';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SendMessage() {
  const { userId } = useParams();
  const [receiver, setReceiver] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers()
      .then(({ data }) => {
        const users = data.usersData || [];
        const found = users.find((u) => u._id === userId);
        setReceiver(found || { _id: userId, name: 'User' });
      })
      .catch(() => setReceiver({ _id: userId, name: 'User' }));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 3) {
      setError('Message must be at least 3 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendAnonymousMessage(userId, content, files);
      setSuccess(true);
      setContent('');
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-sage-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Send anonymous message
            </h1>
            <p className="text-sage-400 text-sm mt-2">
              to {receiver?.name || '...'}
            </p>
          </div>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
              <p className="text-green-300 text-lg font-medium">Message sent!</p>
              <p className="text-sage-400 text-sm mt-2">
                Your anonymous message has been delivered.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2.5 bg-sage-100 text-sage-900 rounded-full text-sm font-semibold"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-sage-800/60 border border-white/5 rounded-3xl p-6 md:p-8"
            >
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your honest message here..."
                rows={6}
                className="w-full bg-sage-900/50 border border-white/10 rounded-2xl p-4 text-sage-100 placeholder:text-sage-500 outline-none focus:border-sage-400 resize-none"
                required
              />

              <div className="mt-4">
                <label className="block text-sm text-sage-400 mb-2">
                  Attach images (optional)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="text-sm text-sage-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-sage-100 file:text-sage-900 file:font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-sage-100 text-sage-900 rounded-full font-semibold hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send anonymously'}
              </button>

              <p className="text-xs text-sage-500 text-center mt-4">
                Your identity will not be revealed to the recipient.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
