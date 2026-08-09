import { useEffect, useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import PlaygroundPanel from './components/PlaygroundPanel';
import ResultsTable from './components/ResultsTable';
import { initialQuery } from './constants/initialQuery';
import { executeIndexerProxy } from './utils/indexerApi';

const normalizePath = (path) => path.replace(/\/+$|^(?=\/)/g, '') || '/';

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [queryText, setQueryText] = useState(JSON.stringify(initialQuery, null, 2));
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (path === '/hub') {
      window.history.replaceState(null, '', '/hub/playground');
      setPath('/hub/playground');
    }
  }, [path]);

  const navigate = (nextPath, replace = false) => {
    const normalized = normalizePath(nextPath);
    if (normalized === path) return;

    if (replace) {
      window.history.replaceState(null, '', normalized);
    } else {
      window.history.pushState(null, '', normalized);
    }

    setPath(normalized);
  };

  const executeQuery = async () => {
    setError(null);
    setResponseData(null);
    let body;

    try {
      body = JSON.parse(queryText);
    } catch (err) {
      setError('Invalid JSON in query editor. Please fix the syntax and try again.');
      return;
    }

    setLoading(true);

    try {
      const data = await executeIndexerProxy(body);
      setResponseData(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch data from backend.');
    } finally {
      setLoading(false);
    }
  };

  if (path === '/' || path === '/home') {
    return <HomeScreen onEnterHub={() => navigate('/hub')} />;
  }

  const view = path.startsWith('/hub') ? path.split('/')[2] || 'playground' : 'playground';
  const activeView = view || 'playground';

  return (
    <div className="app-shell hub-screen">
      <aside className="sidebar">
        <div className="sidebar-brand">Wazuh Assistant</div>
        <nav>
          <button
            className={`sidebar-item ${activeView === 'playground' ? 'active' : ''}`}
            onClick={() => navigate('/hub/playground')}
          >
            Playground
          </button>
          <button
            className={`sidebar-item ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => navigate('/hub/chat')}
          >
            Chat
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {activeView === 'playground' ? (
          <>
            <PlaygroundPanel
              queryText={queryText}
              onQueryChange={setQueryText}
              onExecute={executeQuery}
              loading={loading}
              error={error}
            />
            <ResultsTable responseData={responseData} />
          </>
        ) : (
          <div className="editor-panel">
            <div className="panel-header">
              <div>
                <h2>Chat</h2>
                <p>Chat view will be available here.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
