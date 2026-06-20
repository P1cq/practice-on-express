import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMessage, deleteMessage } from '../api/messages';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';

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
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/dashboard"
            className="text-sm text-sage-400 hover:text-white flex items-center gap-1 mb-6"
          >
            <span>&lt;</span> Back to inbox
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-sage-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : (
            <div className="bg-sage-800/60 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-sage-400">
                  {new Date(message.createdAt).toLocaleString('ar-EG')}
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>

              <p className="text-lg text-sage-100 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {message.attachments?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {message.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={`${API_URL}/${att}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl overflow-hidden border border-white/10"
                    >
                      <img
                        src={`${API_URL}/${att}`}
                        alt={`Attachment ${i + 1}`}
                        className="w-full h-40 object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5 text-sm text-sage-400 space-y-1">
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
