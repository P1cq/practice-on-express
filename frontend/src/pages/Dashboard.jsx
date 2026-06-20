import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, deleteMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';

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
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Your Inbox</h1>
              <p className="text-sage-400 text-sm mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="px-6 py-2.5 bg-sage-100 text-sage-900 rounded-full text-sm font-semibold hover:bg-white transition-colors"
            >
              Copy your link
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-sage-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 bg-sage-800/50 rounded-3xl">
              <p className="text-sage-200 text-lg">No messages yet</p>
              <p className="text-sage-400 text-sm mt-2">
                Share your link to start receiving anonymous messages
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="mt-6 px-6 py-2.5 bg-sage-100 text-sage-900 rounded-full text-sm font-semibold"
              >
                Copy link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isReceived = msg.resiverId?._id === user?._id || msg.resiverId === user?._id;
                return (
                  <div
                    key={msg._id}
                    className="bg-sage-800/60 border border-white/5 rounded-2xl p-5 md:p-6 hover:bg-sage-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full ${
                              isReceived
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {isReceived ? 'Received' : 'Sent'}
                          </span>
                          <span className="text-xs text-sage-400">
                            {new Date(msg.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sage-100 leading-relaxed">{msg.content}</p>
                        {msg.attachments?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={`${API_URL}/${att}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-sage-400 underline hover:text-white"
                              >
                                Attachment {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-sage-400 mt-2">
                          {isReceived
                            ? `From: ${msg.senderId?.name || 'Anonymous'}`
                            : `To: ${msg.resiverId?.name || 'Unknown'}`}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link
                          to={`/messages/${msg._id}`}
                          className="text-xs text-sage-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(msg._id)}
                          className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
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