import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers } from '../api/user';
import { sendAnonymousMessage, sendPublicMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { messageContentSchema, validateWithZod } from '../validation/schemas';
import { validateFiles, ALLOWED_MESSAGE_IMAGE_TYPES } from '../utils/fileValidation';

export default function SendMessage() {
  const { userId } = useParams();
  const { isAuthenticated } = useAuth();
  const [receiver, setReceiver] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [sendWithName, setSendWithName] = useState(false);
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
    setError('');

    const errors = validateWithZod(messageContentSchema, content.trim());
    if (errors) {
      setError(Object.values(errors)[0]);
      return;
    }

    if (files.length > 0) {
      const fileError = validateFiles(files);
      if (fileError) {
        setError(fileError);
        return;
      }
    }

    setLoading(true);
    try {
      if (isAuthenticated && sendWithName) {
        await sendPublicMessage(userId, content, files);
      } else {
        await sendAnonymousMessage(userId, content, files);
      }
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
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-14 paper-grain">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-pine-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-paper-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="font-display text-2xl text-ink-900">
              {sendWithName ? 'Send a message' : 'Write an anonymous note'}
            </h1>
            <p className="text-ink-500 text-sm mt-2">
              to {receiver?.name || '...'}
            </p>
          </div>

          {success ? (
            <div className="note-card p-8 text-center">
              <p className="font-display italic text-xl text-pine-800">Sent.</p>
              <p className="text-ink-500 text-sm mt-2">
                {sendWithName
                  ? 'Your message has been delivered.'
                  : 'Your note is on its way — anonymously.'}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="btn-primary mt-6 px-6 py-2.5 text-sm"
              >
                Write another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-paper rounded-2xl p-6 md:p-8">
              {error && (
                <div className="mb-4 p-3 bg-rose-700/10 border border-rose-700/20 rounded-xl text-rose-700 text-sm">
                  {error}
                </div>
              )}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your honest message here..."
                rows={6}
                className="input-field resize-none"
                required
              />

              {isAuthenticated && (
                <label className="flex items-center gap-2 mt-4 text-sm text-ink-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWithName}
                    onChange={(e) => setSendWithName(e.target.checked)}
                    className="rounded border-paper-300 accent-pine-700"
                  />
                  Send with my name instead of anonymously
                </label>
              )}

              <div className="mt-4">
                <label className="block text-sm text-ink-500 mb-2">
                  Attach images (optional)
                </label>
                <input
                  type="file"
                  accept={ALLOWED_MESSAGE_IMAGE_TYPES.join(',')}
                  multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.files);
                    const fileError = validateFiles(selected);
                    if (fileError) {
                      setError(fileError);
                      e.target.value = '';
                      return;
                    }
                    setError('');
                    setFiles(selected);
                  }}
                  className="text-sm text-ink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pine-100 file:text-pine-800 file:font-medium file:cursor-pointer cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 py-3.5 text-sm"
              >
                {loading ? 'Sending...' : sendWithName ? 'Send message' : 'Send anonymously'}
              </button>

              <p className="text-xs text-ink-400 text-center mt-4">
                {sendWithName
                  ? 'Your name will be shown to the recipient.'
                  : 'Your identity will not be revealed to the recipient.'}
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
