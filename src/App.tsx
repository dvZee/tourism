import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';
import { isAdmin } from './lib/admin';
import { supabase } from './lib/supabase';

function App() {
  const [view, setView] = useState<'chat' | 'admin'>('chat');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);

    if (user) {
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);
    } else {
      setIsUserAdmin(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {isAuthenticated && isUserAdmin && (
        <div className="bg-gray-800 text-white px-4 py-2 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setView('chat')}
                className={`px-4 py-2 rounded ${
                  view === 'chat' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded ${
                  view === 'admin' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                Admin Dashboard
              </button>
            </div>
            <span className="text-sm text-gray-300">Admin Mode</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {view === 'chat' ? <ChatInterface /> : <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
