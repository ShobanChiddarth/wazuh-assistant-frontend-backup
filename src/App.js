import { useEffect, useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import PlaygroundPanel from './components/PlaygroundPanel';
import ChatView from './components/ChatView';
import ResultsTable from './components/ResultsTable';
import { initialQuery } from './constants/initialQuery';
import { executeIndexerProxy } from './utils/indexerApi';

const normalizePath = (path) => path.replace(/\/+$|^(?=\/)/g, '') || '/';

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [playgroundQueryText, setPlaygroundQueryText] = useState(JSON.stringify(initialQuery, null, 2));
  const [playgroundResponseData, setPlaygroundResponseData] = useState(null);
  const [playgroundError, setPlaygroundError] = useState(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  const [chatPromptText, setChatPromptText] = useState('');
  const [chatMessageText, setChatMessageText] = useState('');
  const [chatQueryText, setChatQueryText] = useState('');
  const [chatHasGeneratedQuery, setChatHasGeneratedQuery] = useState(false);
  const [chatResponseData, setChatResponseData] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

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

  const executePlaygroundQuery = async (rawQueryText) => {
    setPlaygroundError(null);
    setPlaygroundResponseData(null);
    let body;

    try {
      body = JSON.parse(rawQueryText);
    } catch (err) {
      setPlaygroundError('Invalid JSON in query editor. Please fix the syntax and try again.');
      return;
    }

    setPlaygroundLoading(true);

    try {
      const data = await executeIndexerProxy(body);
      setPlaygroundResponseData(data);
    } catch (err) {
      setPlaygroundError(err.message || 'Unable to fetch data from backend.');
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const executeChatQuery = async (rawQueryText) => {
    setChatError(null);
    setChatResponseData(null);
    let body;

    try {
      body = JSON.parse(rawQueryText);
    } catch (err) {
      setChatError('Invalid JSON in query editor. Please fix the syntax and try again.');
      return;
    }

    setChatLoading(true);

    try {
      const data = await executeIndexerProxy(body);
      setChatResponseData(data);
    } catch (err) {
      setChatError(err.message || 'Unable to fetch data from backend.');
    } finally {
      setChatLoading(false);
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
        <div className="sidebar-brand" onClick={() => navigate('/')}>Wazuh Assistant</div>
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
              queryText={playgroundQueryText}
              onQueryChange={setPlaygroundQueryText}
              onExecute={() => executePlaygroundQuery(playgroundQueryText)}
              loading={playgroundLoading}
              error={playgroundError}
            />
            <ResultsTable responseData={playgroundResponseData} />
          </>
        ) : (
          <ChatView
            promptText={chatPromptText}
            setPromptText={setChatPromptText}
            messageText={chatMessageText}
            setMessageText={setChatMessageText}
            queryText={chatQueryText}
            setQueryText={setChatQueryText}
            hasGeneratedQuery={chatHasGeneratedQuery}
            setHasGeneratedQuery={setChatHasGeneratedQuery}
            onExecute={() => executeChatQuery(chatQueryText)}
            responseData={chatResponseData}
            setResponseData={setChatResponseData}
            error={chatError}
            setError={setChatError}
            loading={chatLoading}
          />
        )}
      </main>
    </div>
  );
}

export default App;
