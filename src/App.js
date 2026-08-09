import { useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import PlaygroundPanel from './components/PlaygroundPanel';
import ResultsTable from './components/ResultsTable';
import { initialQuery } from './constants/initialQuery';
import { executeIndexerProxy } from './utils/indexerApi';

function App() {
  const [page, setPage] = useState('home');
  const [queryText, setQueryText] = useState(JSON.stringify(initialQuery, null, 2));
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  if (page === 'home') {
    return <HomeScreen onEnterHub={() => setPage('hub')} />;
  }

  return (
    <div className="app-shell hub-screen">
      <aside className="sidebar">
        <div className="sidebar-brand">Wazuh Assistant</div>
        <nav>
          <button className="sidebar-item active">Playground</button>
        </nav>
      </aside>
      <main className="main-content">
        <PlaygroundPanel
          queryText={queryText}
          onQueryChange={setQueryText}
          onExecute={executeQuery}
          loading={loading}
          error={error}
        />
        <ResultsTable responseData={responseData} />
      </main>
    </div>
  );
}

export default App;
