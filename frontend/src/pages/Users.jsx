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
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Users</h1>
          <p className="text-sage-400 text-sm mb-8">
            Send an anonymous message to any user
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-sage-800/60 border border-white/10 rounded-2xl px-5 py-3 text-sage-100 placeholder:text-sage-500 outline-none focus:border-sage-400 mb-6"
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-sage-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sage-400 py-12">No users found</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((u) => (
                <Link
                  key={u._id}
                  to={`/u/${u._id}`}
                  className="flex items-center justify-between bg-sage-800/60 border border-white/5 rounded-2xl p-4 md:p-5 hover:bg-sage-800 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-sage-700 flex items-center justify-center text-sage-200 font-semibold">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-sage-100">
                        {u.name}
                      </p>
                      <p className="text-xs text-sage-400">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-sage-400 group-hover:text-sage-100">
                    Send message →
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
