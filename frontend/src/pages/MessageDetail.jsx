import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMessage, deleteMessage } from '../api/messages';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';
import { safeUrl } from '../utils/safeUrl';

export default function MessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMessage(id)
      .then(({ data }) => setMessage(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Message not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      window.location.href = '/dashboard';
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-14 paper-grain">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/dashboard"
            className="text-sm text-ink-500 hover:text-pine-800 flex items-center gap-1 mb-6"
          >
            <span>&lt;</span> Back to inbox
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-pine-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-rose-700">{error}</div>
          ) : (
            <div className="note-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-ink-400">
                  {new Date(message.createdAt).toLocaleString('en-US')}
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs text-rose-700 hover:text-rose-800 cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <p className="font-display text-xl text-ink-900 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {message.attachments?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {message.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={safeUrl(`${API_URL}/${att}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl overflow-hidden border border-paper-300"
                    >
                      <img
                        src={safeUrl(`${API_URL}/${att}`)}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-40 object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-paper-200 text-sm text-ink-500 space-y-1">
                <p>From: {message.senderId?.name || 'Anonymous'}</p>
                <p>To: {message.resiverId?.name || 'Unknown'}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
