import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/user';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers()
      .then(({ data }) => {
        const list = data.usersData || [];
        setUsers(list);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-14 paper-grain">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-1.5">
            Find someone
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-ink-900 mb-2">
            Who's this note for?
          </h1>
          <p className="text-ink-500 text-sm mb-7">
            Search for a name and send them an honest, unsigned note.
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field mb-6"
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-pine-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-ink-400 py-12">No one found by that name.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((u) => (
                <Link
                  key={u._id}
                  to={`/u/${u._id}`}
                  className="note-card card-lift flex items-center justify-between p-4 md:p-5 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-pine-100 flex items-center justify-center text-pine-800 font-semibold font-display">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-ink-900 font-medium">
                        {u.name}
                      </p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-ink-500 group-hover:text-pine-800">
                    Send a note →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
