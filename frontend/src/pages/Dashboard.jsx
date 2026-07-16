import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, deleteMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';
import { safeUrl } from '../utils/safeUrl';

export default function Dashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setMessages([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert('Failed to delete message');
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/u/${user?._id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-14 paper-grain">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9">
            <div>
              <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-1.5">
                Your letterbox
              </p>
              <h1 className="font-display text-2xl md:text-3xl text-ink-900">
                {user?.name ? `Welcome back, ${user.name}` : 'Your inbox'}
              </h1>
            </div>
            <button type="button" onClick={copyLink} className="btn-primary px-6 py-2.5 text-sm shrink-0">
              Copy your link
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-pine-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-rose-700">{error}</div>
          ) : messages.length === 0 ? (
            <div className="card-paper rounded-2xl text-center py-16 px-6">
              <p className="font-display italic text-xl text-ink-900">No notes yet</p>
              <p className="text-ink-500 text-sm mt-2">
                Share your link and the first one will find its way here.
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="btn-primary mt-6 px-6 py-2.5 text-sm"
              >
                Copy your link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isReceived = msg.resiverId?._id === user?._id || msg.resiverId === user?._id;
                return (
                  <div key={msg._id} className="note-card card-lift p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              isReceived
                                ? 'bg-pine-100 text-pine-800'
                                : 'bg-ochre-100 text-ochre-700'
                            }`}
                          >
                            {isReceived ? 'Received' : 'Sent'}
                          </span>
                          <span className="text-xs text-ink-400">
                            {new Date(msg.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-ink-900 leading-relaxed">{msg.content}</p>
                        {msg.attachments?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={safeUrl(`${API_URL}/${att}`)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-pine-700 underline hover:text-pine-900"
                              >
                                Attachment {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-ink-400 mt-2.5">
                          {isReceived
                            ? `From: ${msg.senderId?.name || 'Anonymous'}`
                            : `To: ${msg.resiverId?.name || 'Unknown'}`}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Link
                          to={`/messages/${msg._id}`}
                          className="text-xs text-ink-700 hover:text-pine-800 px-3 py-1.5 rounded-lg hover:bg-paper-100"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(msg._id)}
                          className="text-xs text-rose-700 hover:text-rose-800 px-3 py-1.5 rounded-lg hover:bg-rose-700/10 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
